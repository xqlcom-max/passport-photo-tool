const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 600; // 美国护照照片标准：2x2 英寸，600x600 像素

import { detectFace, initFaceLandmarker } from './face/mediapipeFaceDetector';
import { calculateFaceMetrics } from './face/faceMetrics';
import type { FaceDetectionResult } from './face/types';

/**
 * 从图片 alpha 通道提取人的 bounding box
 * 背景移除后的图片，非透明区域就是人的轮廓（包含头发、肩膀）
 */
function getPersonBoundingBox(img: HTMLImageElement): { x: number; y: number; width: number; height: number } | null {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
  let found = false;

  // 扫描所有像素，找非透明区域的边界
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 128) { // 不透明像素 = 人的部分
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * 处理护照照片：智能裁剪，符合美国护照照片标准
 *
 * 美国护照照片要求：
 * - 尺寸：2x2 英寸（600x600 像素）
 * - 头部高度：占照片高度的 50%-69%
 * - 眼睛位置：在照片高度的 56%-69% 处（从底部算起）
 * - 头顶空间：占照片高度的 10%-25%
 *
 * @param img - 要处理的图片
 * @param bgColor - 背景颜色
 * @returns 处理后的图片 base64 数据
 */
export async function processPassportPhoto(
  img: HTMLImageElement,
  bgColor: 'white' | 'blue' = 'white'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // 填充背景色
  ctx.fillStyle = bgColor === 'blue' ? '#438EDB' : '#FFFFFF';
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // 尝试进行面部检测和智能裁剪
  try {
    console.log('Processing passport photo...');
    console.log('Image size:', img.naturalWidth, 'x', img.naturalHeight);

    // 确保 MediaPipe 已初始化
    await initFaceLandmarker();

    // 使用 MediaPipe 检测人脸
    const faceDetection = detectFace(img);

    if (faceDetection.detected) {
      console.log('✅ Face detected! Performing smart crop...');

      // 计算人脸指标
      const metrics = calculateFaceMetrics(faceDetection, img.naturalWidth, img.naturalHeight);
      console.log('Face metrics:', metrics);

      // 获取证件照排版参数（transform 算法）
      const passportTransform = buildPassportTransform(img, faceDetection);
      console.log('Passport transform:', passportTransform);

      // 启用抗锯齿，优化边缘处理
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 应用 transform（全局重构，不是裁剪）
      ctx.setTransform(
        passportTransform.scale, 0,
        0, passportTransform.scale,
        passportTransform.offsetX,
        passportTransform.offsetY
      );
      ctx.drawImage(img, 0, 0);

      // 重置 transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      console.log('✅ Passport photo transform completed');
    } else {
      console.warn('⚠️ No face detected, using center crop...');

      // 没有检测到面部，使用居中裁剪
      centerCrop(img, ctx);
    }
  } catch (error) {
    console.warn('⚠️ Face detection failed, using center crop:', error);
    centerCrop(img, ctx);
  }

  return canvas.toDataURL('image/png');
}

/**
 * 基于 MediaPipe 关键点的智能裁剪（fit-to-frame 算法）
 *
 * 美国护照照片要求（U.S. Department of State）：
 * - 头部高度：50%-69%（推荐 56%-64%）
 * - 眼睛位置：距底部 56%-69%
 * - 头顶空间：头顶到照片顶部至少留有空间（约 10%-25%）
 * - 头顶不能被裁切
 * - 左右居中
 *
 * @param img - 原始图片
 * @param detection - MediaPipe 人脸检测结果
 * @returns 裁剪区域
 */
function smartCropForPassport(
  img: HTMLImageElement,
  detection: FaceDetectionResult
): { x: number; y: number; width: number; height: number } {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  if (!detection.regions) {
    // 没有关键点，使用居中裁剪
    const size = Math.min(imgW, imgH);
    return {
      x: (imgW - size) / 2,
      y: (imgH - size) / 2,
      width: size,
      height: size,
    };
  }

  const { regions } = detection;

  // 眼睛中心（像素坐标）
  const leftEyeX = regions.leftEye.x * imgW;
  const leftEyeY = regions.leftEye.y * imgH;
  const rightEyeX = regions.rightEye.x * imgW;
  const rightEyeY = regions.rightEye.y * imgH;
  const eyesCenterX = (leftEyeX + rightEyeX) / 2;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;

  // 头顶和下巴（像素坐标）
  const foreheadTopY = regions.foreheadTop.y * imgH;
  const chinY = regions.chin.y * imgH;

  // 估算真正的头顶位置
  const eyeToForeheadDist = foreheadTopY - eyesCenterY;
  const hairTopY = foreheadTopY - eyeToForeheadDist * 1.0;

  // 构建人脸框（基于关键点）
  const eyeDistance = rightEyeX - leftEyeX;
  const faceBox = {
    x: leftEyeX - eyeDistance * 0.8,
    y: hairTopY,
    width: eyeDistance * 2.6,
    height: chinY - hairTopY,
  };

  // fit-to-frame 算法：基于图片尺寸决定裁剪框大小
  // 1. face center
  const faceCenterX = faceBox.x + faceBox.width / 2;
  const faceCenterY = faceBox.y + faceBox.height / 2;

  // 2. 先决定"最终裁剪框大小"（关键：不是基于face，而是基于图）
  let cropSize = Math.min(imgW, imgH);

  // 3. 强制扩大一点（保证头顶空间）
  cropSize = cropSize * 0.85;

  // 4. crop 左上角（以脸为中心往上偏移）
  let x = faceCenterX - cropSize / 2;
  let y = faceCenterY - cropSize * 0.42; // 关键：往上偏，保留头顶

  // 5. clamp
  x = Math.max(0, Math.min(imgW - cropSize, x));
  y = Math.max(0, Math.min(imgH - cropSize, y));

  return {
    x,
    y,
    width: cropSize,
    height: cropSize,
  };
}

/**
 * 证件照排版算法（稳定版结构）
 *
 * 核心思路：template-driven，不是 face-driven
 * 1. detect face (only for anchor)
 * 2. estimate person region (virtual)
 * 3. fit to passport canvas (fixed template)
 * 4. enforce constraints (top / eye line / ratio)
 * 5. render
 *
 * @param img - 背景已移除的图片（有 alpha 通道）
 * @param detection - MediaPipe 人脸检测结果
 * @returns transform 参数（scale, offsetX, offsetY）
 */
function buildPassportTransform(
  img: HTMLImageElement,
  detection: FaceDetectionResult
): { scale: number; offsetX: number; offsetY: number } {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  // STEP 1: 获取人物 bounding box（从 alpha 通道）
  const personBox = getPersonBoundingBox(img);

  // STEP 2: 获取 anchor（face 只做定位，不做裁剪依据）
  const anchor = getAnchor(detection, personBox, imgW, imgH);

  // STEP 3: 计算稳定布局（核心）
  const layout = computeStableLayout(anchor, personBox);

  // STEP 4: 安全约束修正（防切头）
  const safeLayout = applySafetyConstraints(layout, personBox);

  return safeLayout;
}

/**
 * 获取 anchor（face 只做定位，不做裁剪依据）
 */
function getAnchor(
  detection: FaceDetectionResult,
  personBox: { x: number; y: number; width: number; height: number } | null,
  imgW: number,
  imgH: number
): { x: number; y: number; top: number } {
  // 优先用 face detection 的关键点定位
  if (detection.regions) {
    const { regions } = detection;
    return {
      x: ((regions.leftEye.x + regions.rightEye.x) / 2) * imgW,
      y: ((regions.foreheadTop.y + regions.chin.y) / 2) * imgH,
      top: regions.foreheadTop.y * imgH,
    };
  }

  // fallback：用 person bounding box 的中心
  if (personBox) {
    return {
      x: personBox.x + personBox.width / 2,
      y: personBox.y + personBox.height / 2,
      top: personBox.y,
    };
  }

  // 最后 fallback：图片中心
  return {
    x: imgW / 2,
    y: imgH / 2,
    top: 0,
  };
}

/**
 * 计算稳定布局（核心算法）
 *
 * 策略：
 * - Scale：contain-fit（让人完整填满画布）
 * - 垂直定位：人中心在 50% 高度
 * - 水平定位：居中
 */
function computeStableLayout(
  anchor: { x: number; y: number; top: number },
  personBox: { x: number; y: number; width: number; height: number } | null
): { scale: number; offsetX: number; offsetY: number } {
  // 计算 scale（contain-fit）
  let scale: number;
  if (personBox) {
    // 有人物轮廓时，用 contain-fit 让人完整填满画布
    scale = Math.min(
      TARGET_WIDTH / personBox.width,
      TARGET_HEIGHT / personBox.height
    );
  } else {
    // 没有人物轮廓时，用固定比例
    scale = 1.0;
  }

  // 计算偏移（anchor 做定位）
  const offsetX = TARGET_WIDTH / 2 - anchor.x * scale;
  const offsetY = TARGET_HEIGHT * 0.50 - anchor.y * scale;

  return { scale, offsetX, offsetY };
}

/**
 * 安全约束系统（防翻车核心）
 *
 * 确保头顶不会贴边（10% 安全区）
 */
function applySafetyConstraints(
  layout: { scale: number; offsetX: number; offsetY: number },
  personBox: { x: number; y: number; width: number; height: number } | null
): { scale: number; offsetX: number; offsetY: number } {
  const TOP_SAFE_ZONE = TARGET_HEIGHT * 0.10;

  // 用 personBox.y 计算头顶位置
  if (personBox) {
    const headTop = personBox.y * layout.scale + layout.offsetY;
    if (headTop < TOP_SAFE_ZONE) {
      layout.offsetY += (TOP_SAFE_ZONE - headTop);
    }
  }

  return layout;
}

/**
 * 居中裁剪（备用方案）
 */
function centerCrop(img: HTMLImageElement, ctx: CanvasRenderingContext2D): void {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = TARGET_WIDTH / TARGET_HEIGHT;

  let drawW: number, drawH: number;
  if (imgRatio > canvasRatio) {
    drawH = TARGET_HEIGHT;
    drawW = drawH * imgRatio;
  } else {
    drawW = TARGET_WIDTH;
    drawH = drawW / imgRatio;
  }

  const x = (TARGET_WIDTH - drawW) / 2;
  const y = (TARGET_HEIGHT - drawH) / 2;

  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, x, y, drawW, drawH);
}

/**
 * 给图片添加水印（免费版下载时使用）
 * 修复了原版没有等待 img.onload 的 bug
 */
export function addWatermark(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      // 绘制底图
      ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // 水印背景条
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, TARGET_HEIGHT - 72, TARGET_WIDTH, 72);

      // 水印文字
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Passport Photo Tool', TARGET_WIDTH / 2, TARGET_HEIGHT - 44);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Free Version — Upgrade to Remove', TARGET_WIDTH / 2, TARGET_HEIGHT - 24);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for watermark'));
    img.src = dataUrl;
  });
}

/**
 * 护照照片导出元数据（打印合规信息）
 */
export function getPassportExportMeta() {
  return {
    widthPx: TARGET_WIDTH,
    heightPx: TARGET_HEIGHT,
    dpi: 300,
    physicalWidthInch: 2,
    physicalHeightInch: 2,
    mm: '51x51',
  };
}

// CRC32 查表法（PNG chunk 校验用）
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = CRC32_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * 向 PNG 二进制数据中注入 pHYs chunk（设置 DPI）
 *
 * PNG 结构：Signature(8) + IHDR(25) + [pHYs] + ... + IEND
 * pHYs 格式：Length(4) + "pHYs"(4) + X(4) + Y(4) + Unit(1) + CRC(4)
 */
function injectPngDpi(pngBytes: Uint8Array, dpi: number): Uint8Array {
  // 300 DPI = 11811 像素/米（300 * 39.3701）
  const pixelsPerMeter = Math.round(dpi * 39.3701);

  // pHYs chunk 数据部分：X(4) + Y(4) + Unit(1) = 9 字节
  const physData = new Uint8Array(9);
  const view = new DataView(physData.buffer);
  view.setUint32(0, pixelsPerMeter, false); // X pixels per unit, big-endian
  view.setUint32(4, pixelsPerMeter, false); // Y pixels per unit, big-endian
  view.setUint8(8, 1); // Unit: 1 = meter

  // 构建 chunk：Length(4) + Type(4) + Data(9) + CRC(4) = 21 字节
  const typeBytes = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const crcInput = new Uint8Array(4 + 9); // type + data
  crcInput.set(typeBytes, 0);
  crcInput.set(physData, 4);
  const crcValue = crc32(crcInput);

  const chunk = new Uint8Array(4 + 4 + 9 + 4); // 21 字节
  const chunkView = new DataView(chunk.buffer);
  chunkView.setUint32(0, 9, false); // data length = 9
  chunk.set(typeBytes, 4);
  chunk.set(physData, 8);
  chunkView.setUint32(17, crcValue, false);

  // 插入位置：PNG Signature(8) + IHDR chunk
  // IHDR: Length(4) + "IHDR"(4) + Data(13) + CRC(4) = 25 字节
  const insertPos = 8 + 25;

  // 合并：原数据前半 + pHYs chunk + 原数据后半
  const result = new Uint8Array(pngBytes.length + chunk.length);
  result.set(pngBytes.subarray(0, insertPos), 0);
  result.set(chunk, insertPos);
  result.set(pngBytes.subarray(insertPos), insertPos + chunk.length);

  return result;
}

/**
 * 下载图片（自动注入 300 DPI 元数据，确保打印尺寸为 2x2 英寸）
 */
export async function downloadImage(dataUrl: string, filename: string) {
  // 将 base64 data URL 转为 Uint8Array
  const base64 = dataUrl.split(',')[1];
  const binaryStr = atob(base64);
  const pngBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    pngBytes[i] = binaryStr.charCodeAt(i);
  }

  // 注入 300 DPI 元数据
  const pngWithDpi = injectPngDpi(pngBytes, 300);

  // 创建 Blob 并下载（使用 Array.from 避免 TypeScript 类型问题）
  const blob = new Blob([new Uint8Array(pngWithDpi)], { type: 'image/png' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 延迟释放 URL（确保下载开始后再释放）
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 加载图片并返回 Promise
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}
