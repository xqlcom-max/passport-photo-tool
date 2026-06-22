const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 600; // 美国护照照片标准：2x2 英寸，600x600 像素

import { detectFace, initFaceLandmarker } from './face/mediapipeFaceDetector';
import { calculateFaceMetrics } from './face/faceMetrics';
import type { FaceDetectionResult } from './face/types';

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

      // 获取智能裁剪区域
      const cropArea = smartCropForPassport(img, faceDetection);
      console.log('Crop area:', cropArea);

      // 计算缩放比例，确保裁剪区域填满画布
      const scaleX = TARGET_WIDTH / cropArea.width;
      const scaleY = TARGET_HEIGHT / cropArea.height;
      const scale = Math.max(scaleX, scaleY);

      const drawWidth = cropArea.width * scale;
      const drawHeight = cropArea.height * scale;
      const drawX = (TARGET_WIDTH - drawWidth) / 2;
      const drawY = (TARGET_HEIGHT - drawHeight) / 2;

      // 启用抗锯齿，优化边缘处理
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 绘制裁剪后的图片
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        drawX, drawY, drawWidth, drawHeight
      );

      console.log('✅ Smart crop completed');
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
 * 基于 MediaPipe 关键点的智能裁剪
 *
 * 美国护照照片要求：
 * - 头部高度：50%-69%（推荐 56%-64%）
 * - 眼睛位置：距底部 56%-69%（推荐 55%-64%）
 * - 头顶空间：10%-25%
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

  // 头部高度
  const headHeight = Math.abs(chinY - foreheadTopY);

  // 目标头部高度比例（推荐 58%）
  const targetHeadHeightRatio = 0.58;

  // 计算裁剪区域大小
  // 头部高度 = 裁剪高度 * targetHeadHeightRatio
  const cropHeight = headHeight / targetHeadHeightRatio;
  const cropWidth = cropHeight; // 正方形

  // 裁剪区域中心 Y：眼睛在裁剪区域的 35%-40% 处
  // 目标：眼睛 Y = cropY + cropHeight * 0.38
  const targetEyeYInCrop = cropHeight * 0.38;
  const cropCenterY = eyesCenterY - targetEyeYInCrop + cropHeight / 2;

  // 裁剪区域中心 X：以眼睛中心为准
  const cropCenterX = eyesCenterX;

  // 计算裁剪区域坐标
  let cropX = cropCenterX - cropWidth / 2;
  let cropY = cropCenterY - cropHeight / 2;

  // 边界检查：确保不超出图片范围
  cropX = Math.max(0, Math.min(cropX, imgW - cropWidth));
  cropY = Math.max(0, Math.min(cropY, imgH - cropHeight));

  // 如果裁剪区域超出图片，调整大小
  if (cropWidth > imgW || cropHeight > imgH) {
    const size = Math.min(imgW, cropWidth, cropHeight);
    return {
      x: (imgW - size) / 2,
      y: (imgH - size) / 2,
      width: size,
      height: size,
    };
  }

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  };
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
 * 下载图片
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
