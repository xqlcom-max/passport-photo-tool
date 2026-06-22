/**
 * 人脸指标计算
 * 根据 MediaPipe 关键点计算护照裁剪和合规检测所需的各种指标
 */

import type {
  FaceDetectionResult,
  FaceMetrics,
  Point3D,
} from './types';

/**
 * 计算人脸指标
 * @param detection - 人脸检测结果
 * @param imageWidth - 图片宽度（像素）
 * @param imageHeight - 图片高度（像素）
 * @returns 人脸指标
 */
export function calculateFaceMetrics(
  detection: FaceDetectionResult,
  imageWidth: number,
  imageHeight: number
): FaceMetrics | null {
  if (!detection.detected || !detection.regions) {
    return null;
  }

  const { regions } = detection;

  // 眼睛中心（像素坐标）
  const leftEyeX = regions.leftEye.x * imageWidth;
  const leftEyeY = regions.leftEye.y * imageHeight;
  const rightEyeX = regions.rightEye.x * imageWidth;
  const rightEyeY = regions.rightEye.y * imageHeight;

  // 眼睛中心
  const eyesCenterX = (leftEyeX + rightEyeX) / 2;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;

  // 两眼间距
  const interEyeDistance = Math.sqrt(
    Math.pow(rightEyeX - leftEyeX, 2) + Math.pow(rightEyeY - leftEyeY, 2)
  );

  // 人脸高度（从头顶到下巴）
  const foreheadTopY = regions.foreheadTop.y * imageHeight;
  const chinY = regions.chin.y * imageHeight;
  const faceHeight = Math.abs(chinY - foreheadTopY);

  // 人脸宽度（从左耳到右耳）
  const leftEarX = regions.leftEar.x * imageWidth;
  const rightEarX = regions.rightEar.x * imageWidth;
  const faceWidth = Math.abs(rightEarX - leftEarX);

  // 头部高度占图片高度的比例
  const headHeightRatio = faceHeight / imageHeight;

  // 眼睛 Y 位置距底部的比例
  const eyesYFromBottom = (imageHeight - eyesCenterY) / imageHeight;

  // 人脸中心偏移（相对图片中心）
  const imageCenterX = imageWidth / 2;
  const imageCenterY = imageHeight / 2;
  const centerOffsetX = (eyesCenterX - imageCenterX) / imageWidth;
  const centerOffsetY = (eyesCenterY - imageCenterY) / imageHeight;

  return {
    faceWidth,
    faceHeight,
    headHeightRatio,
    eyesYFromBottom,
    eyesCenterX,
    eyesCenterY,
    interEyeDistance,
    centerOffsetX,
    centerOffsetY,
  };
}

/**
 * 获取人脸宽度（像素）
 */
export function getFaceWidth(detection: FaceDetectionResult): number {
  if (!detection.detected || !detection.regions) return 0;

  const { leftEar, rightEar } = detection.regions;
  return Math.abs(rightEar.x - leftEar.x);
}

/**
 * 获取人脸高度（像素）
 */
export function getFaceHeight(detection: FaceDetectionResult): number {
  if (!detection.detected || !detection.regions) return 0;

  const { foreheadTop, chin } = detection.regions;
  return Math.abs(chin.y - foreheadTop.y);
}

/**
 * 检查是否正脸
 * 根据 headRotation 判断
 */
export function isFrontFacing(
  detection: FaceDetectionResult,
  maxPitch: number = 10,
  maxYaw: number = 10,
  maxRoll: number = 10
): { isFront: boolean; pitch: number; yaw: number; roll: number } {
  if (!detection.headRotation) {
    return { isFront: false, pitch: 0, yaw: 0, roll: 0 };
  }

  const { pitch, yaw, roll } = detection.headRotation;

  const isFront =
    Math.abs(pitch) <= maxPitch &&
    Math.abs(yaw) <= maxYaw &&
    Math.abs(roll) <= maxRoll;

  return { isFront, pitch, yaw, roll };
}

/**
 * 计算眼睛到图片顶部的距离比例
 * 用于判断眼睛位置是否在护照要求的范围内
 */
export function getEyesYRatio(detection: FaceDetectionResult): number | null {
  if (!detection.detected || !detection.regions) return null;

  const { leftEye, rightEye } = detection.regions;
  const eyesCenterY = (leftEye.y + rightEye.y) / 2;

  // 返回眼睛 Y 位置距顶部的比例（0 = 顶部，1 = 底部）
  return eyesCenterY;
}
