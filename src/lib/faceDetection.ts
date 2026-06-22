/**
 * 面部检测和智能裁剪工具
 *
 * 使用 @vladmandic/face-api 实现面部检测
 * 确保裁剪后的照片符合美国护照照片标准
 *
 * 注意：此模块仅在浏览器端运行
 */

// 面部检测结果类型（简化）
type FaceDetectionResult = any;

// 美国护照照片标准
export const US_PASSPORT_STANDARDS = {
  // 尺寸要求（像素）
  width: 600,
  height: 600,

  // 头部高度要求（占照片高度的比例）
  headHeightMin: 0.50, // 50%
  headHeightMax: 0.69, // 69%

  // 眼睛位置要求（从照片底部到眼睛的距离，占照片高度的比例）
  eyePositionMin: 0.56, // 56%
  eyePositionMax: 0.69, // 69%

  // 头顶到照片顶部的空间要求
  topSpaceMin: 0.10, // 10%
  topSpaceMax: 0.25, // 25%
};

// face-api 实例（延迟加载）
let faceapi: any = null;
let modelsLoaded = false;

/**
 * 动态加载 face-api.js
 */
async function getFaceApi() {
  if (faceapi) return faceapi;

  try {
    // 动态导入，避免 SSR 问题
    const module = await import('@vladmandic/face-api');
    faceapi = module;
    return faceapi;
  } catch (error) {
    console.error('Failed to load face-api:', error);
    throw error;
  }
}

/**
 * 加载 face-api.js 模型
 * 从本地 /models/ 目录加载
 */
export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded) return;

  const faceapi = await getFaceApi();

  try {
    console.log('Loading face detection models from /models/...');

    // 加载 TinyFaceDetector 模型
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    console.log('✅ TinyFaceDetector model loaded');

    // 加载 FaceLandmark68 模型
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    console.log('✅ FaceLandmark68Net model loaded');

    modelsLoaded = true;
    console.log('✅ All face detection models loaded successfully');
  } catch (error) {
    console.error('❌ Error loading face detection models:', error);
    throw error;
  }
}

/**
 * 检测面部位置
 */
export async function detectFace(
  image: HTMLImageElement
): Promise<FaceDetectionResult | null> {
  try {
    console.log('Starting face detection...');
    const faceapi = await getFaceApi();
    await loadFaceApiModels();

    console.log('Detecting faces...');
    console.log('Image size:', image.naturalWidth, 'x', image.naturalHeight);

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,      // 更大的输入尺寸，检测更准确
      scoreThreshold: 0.3  // 降低阈值，更容易检测到
    });

    const detections = await faceapi
      .detectAllFaces(image, options)
      .withFaceLandmarks();

    console.log(`Detected ${detections.length} face(s)`);

    if (detections.length === 0) {
      console.warn('⚠️ No face detected in the image');
      return null;
    }

    // 返回最大的面部（最靠近摄像头的）
    const largest = detections.reduce((largest: any, current: any) =>
      current.detection.area > largest.detection.area ? current : largest
    );

    console.log('✅ Largest face detected:', {
      box: largest.detection.box,
      score: largest.detection.score
    });

    return largest;
  } catch (error) {
    console.error('❌ Face detection error:', error);
    return null;
  }
}

/**
 * 根据面部位置智能裁剪照片
 * 符合美国护照照片标准
 */
export function smartCropForPassport(
  image: HTMLImageElement,
  faceDetection: FaceDetectionResult
): { x: number; y: number; width: number; height: number } {
  const imgWidth = image.naturalWidth;
  const imgHeight = image.naturalHeight;

  // 获取面部边界框
  const faceBox = faceDetection.detection.box;
  const faceWidth = faceBox.width;
  const faceHeight = faceBox.height;

  // 获取眼睛位置（使用面部特征点）
  const landmarks = faceDetection.landmarks;
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // 计算眼睛中心点
  const eyeCenterX = (leftEye[0].x + rightEye[0].x) / 2;
  const eyeCenterY = (leftEye[0].y + rightEye[0].y) / 2;

  console.log('Face analysis:', {
    faceBox: { x: faceBox.x, y: faceBox.y, width: faceBox.width, height: faceBox.height },
    eyeCenter: { x: eyeCenterX, y: eyeCenterY }
  });

  // 根据美国护照标准计算裁剪区域
  // 目标：头部占照片高度的 60%，眼睛在照片高度的 35% 处（从顶部算起）
  const targetCropSize = Math.max(imgWidth, imgHeight) * 0.9;

  // 目标眼睛位置（从照片顶部算起，占 35%）
  const targetEyeY = targetCropSize * 0.35;

  // 计算裁剪区域 - 以眼睛为中心
  let cropX = eyeCenterX - targetCropSize / 2;
  let cropY = eyeCenterY - targetEyeY;

  // 确保裁剪区域在图片范围内
  cropX = Math.max(0, Math.min(cropX, imgWidth - targetCropSize));
  cropY = Math.max(0, Math.min(cropY, imgHeight - targetCropSize));

  console.log('Crop calculation:', {
    targetCropSize,
    cropX,
    cropY
  });

  return {
    x: cropX,
    y: cropY,
    width: targetCropSize,
    height: targetCropSize
  };
}

/**
 * 验证裁剪结果是否符合美国护照标准
 */
export function validatePassportCrop(
  image: HTMLImageElement,
  faceDetection: FaceDetectionResult,
  cropArea: { x: number; y: number; width: number; height: number }
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const faceBox = faceDetection.detection.box;

  // 计算面部在裁剪区域中的相对位置
  const faceRelativeHeight = faceBox.height / cropArea.height;

  // 检查头部高度（应该是照片高度的 50%-69%）
  const headHeightRatio = faceRelativeHeight;
  if (headHeightRatio < US_PASSPORT_STANDARDS.headHeightMin) {
    issues.push(`头部高度不足: ${Math.round(headHeightRatio * 100)}% < ${Math.round(US_PASSPORT_STANDARDS.headHeightMin * 100)}%`);
  }
  if (headHeightRatio > US_PASSPORT_STANDARDS.headHeightMax) {
    issues.push(`头部高度过大: ${Math.round(headHeightRatio * 100)}% > ${Math.round(US_PASSPORT_STANDARDS.headHeightMax * 100)}%`);
  }

  // 检查眼睛位置
  const landmarks = faceDetection.landmarks;
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const eyeCenterY = (leftEye[0].y + rightEye[0].y) / 2;
  const eyePositionFromBottom = 1 - ((eyeCenterY - cropArea.y) / cropArea.height);

  if (eyePositionFromBottom < US_PASSPORT_STANDARDS.eyePositionMin) {
    issues.push(`眼睛位置过低: ${Math.round(eyePositionFromBottom * 100)}% < ${Math.round(US_PASSPORT_STANDARDS.eyePositionMin * 100)}%`);
  }
  if (eyePositionFromBottom > US_PASSPORT_STANDARDS.eyePositionMax) {
    issues.push(`眼睛位置过高: ${Math.round(eyePositionFromBottom * 100)}% > ${Math.round(US_PASSPORT_STANDARDS.eyePositionMax * 100)}%`);
  }

  // 检查头顶空间
  const faceRelativeY = (faceBox.y - cropArea.y) / cropArea.height;
  const topSpaceRatio = faceRelativeY;
  if (topSpaceRatio < US_PASSPORT_STANDARDS.topSpaceMin) {
    issues.push(`头顶空间不足: ${Math.round(topSpaceRatio * 100)}% < ${Math.round(US_PASSPORT_STANDARDS.topSpaceMin * 100)}%`);
  }
  if (topSpaceRatio > US_PASSPORT_STANDARDS.topSpaceMax) {
    issues.push(`头顶空间过大: ${Math.round(topSpaceRatio * 100)}% > ${Math.round(US_PASSPORT_STANDARDS.topSpaceMax * 100)}%`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
