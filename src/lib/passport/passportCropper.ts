/**
 * 护照照片智能裁剪器
 *
 * 根据 MediaPipe 人脸关键点，按美国护照标准自动裁剪
 */

import type { FaceDetectionResult, FaceRegions } from '../face/types';
import {
  HEAD_SIZE_STANDARDS,
  EYES_POSITION_STANDARDS,
} from './usPassportStandards';

/** 裁剪区域 */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 基于人脸关键点的护照照片智能裁剪
 *
 * 美国护照照片要求：
 * - 头部高度：50%-69%（推荐 58%）
 * - 眼睛位置：距底部 56%-69%（推荐 62%）
 * - 头顶空间：10%-25%
 * - 左右居中
 *
 * @param img - 原始图片
 * @param detection - MediaPipe 人脸检测结果
 * @returns 裁剪区域
 */
export function smartCropForPassport(
  img: HTMLImageElement,
  detection: FaceDetectionResult
): CropArea {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  // 没有关键点，使用居中裁剪
  if (!detection.regions) {
    return centerCropFallback(imgW, imgH);
  }

  const { regions } = detection;

  // 1. 计算头部高度（从头顶到下巴）
  const foreheadTopY = regions.foreheadTop.y * imgH;
  const chinY = regions.chin.y * imgH;
  const headHeight = Math.abs(chinY - foreheadTopY);

  // 2. 计算目标头部高度比例（推荐 58%）
  const targetHeadHeightRatio = HEAD_SIZE_STANDARDS.recommendedHeightRatio;

  // 3. 计算裁剪区域大小
  // 头部高度 = 裁剪高度 * targetHeadHeightRatio
  const cropHeight = headHeight / targetHeadHeightRatio;
  const cropWidth = cropHeight; // 正方形

  // 4. 计算眼睛中心位置（像素坐标）
  const leftEyeX = regions.leftEye.x * imgW;
  const leftEyeY = regions.leftEye.y * imgH;
  const rightEyeX = regions.rightEye.x * imgW;
  const rightEyeY = regions.rightEye.y * imgH;
  const eyesCenterX = (leftEyeX + rightEyeX) / 2;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;

  // 5. 计算裁剪区域中心 Y
  // 目标：眼睛在裁剪区域的 38% 处（从顶部算起）
  // 即：eyesCenterY = cropY + cropHeight * 0.38
  const targetEyeYInCrop = 0.38;
  const cropCenterY = eyesCenterY - cropHeight * targetEyeYInCrop + cropHeight / 2;

  // 6. 计算裁剪区域中心 X
  const cropCenterX = eyesCenterX;

  // 7. 计算裁剪区域坐标
  let cropX = cropCenterX - cropWidth / 2;
  let cropY = cropCenterY - cropHeight / 2;

  // 8. 边界检查：确保不超出图片范围
  if (cropX < 0) cropX = 0;
  if (cropY < 0) cropY = 0;
  if (cropX + cropWidth > imgW) cropX = imgW - cropWidth;
  if (cropY + cropHeight > imgH) cropY = imgH - cropHeight;

  // 9. 如果裁剪区域超出图片，调整大小
  if (cropWidth > imgW || cropHeight > imgH) {
    const size = Math.min(imgW, cropHeight);
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
function centerCropFallback(imgW: number, imgH: number): CropArea {
  const size = Math.min(imgW, imgH);
  return {
    x: (imgW - size) / 2,
    y: (imgH - size) / 2,
    width: size,
    height: size,
  };
}

/**
 * 验证裁剪是否符合护照标准
 */
export function validateCropForPassport(
  img: HTMLImageElement,
  detection: FaceDetectionResult,
  cropArea: CropArea
): {
  valid: boolean;
  issues: string[];
  metrics: {
    headHeightRatio: number;
    eyeYFromBottom: number;
    topSpaceRatio: number;
  };
} {
  const issues: string[] = [];
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  if (!detection.regions) {
    return { valid: false, issues: ['无法获取人脸关键点'], metrics: { headHeightRatio: 0, eyeYFromBottom: 0, topSpaceRatio: 0 } };
  }

  const { regions } = detection;

  // 计算实际的头部高度比例
  const foreheadTopY = regions.foreheadTop.y * imgH;
  const chinY = regions.chin.y * imgH;
  const headHeight = Math.abs(chinY - foreheadTopY);
  const headHeightRatio = headHeight / cropArea.height;

  // 计算眼睛 Y 位置距底部的比例
  const leftEyeY = regions.leftEye.y * imgH;
  const rightEyeY = regions.rightEye.y * imgH;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;
  const eyeYFromBottom = (cropArea.height - (eyesCenterY - cropArea.y)) / cropArea.height;

  // 计算头顶空间比例
  const topSpace = foreheadTopY - cropArea.y;
  const topSpaceRatio = topSpace / cropArea.height;

  // 检查头部高度
  if (headHeightRatio < HEAD_SIZE_STANDARDS.minHeightRatio) {
    issues.push(`头部太小: ${(headHeightRatio * 100).toFixed(1)}% (最小 ${HEAD_SIZE_STANDARDS.minHeightRatio * 100}%)`);
  }
  if (headHeightRatio > HEAD_SIZE_STANDARDS.maxHeightRatio) {
    issues.push(`头部太大: ${(headHeightRatio * 100).toFixed(1)}% (最大 ${HEAD_SIZE_STANDARDS.maxHeightRatio * 100}%)`);
  }

  // 检查眼睛位置
  if (eyeYFromBottom < EYES_POSITION_STANDARDS.minYFromBottom) {
    issues.push(`眼睛位置太低: ${(eyeYFromBottom * 100).toFixed(1)}% (最小 ${EYES_POSITION_STANDARDS.minYFromBottom * 100}%)`);
  }
  if (eyeYFromBottom > EYES_POSITION_STANDARDS.maxYFromBottom) {
    issues.push(`眼睛位置太高: ${(eyeYFromBottom * 100).toFixed(1)}% (最大 ${EYES_POSITION_STANDARDS.maxYFromBottom * 100}%)`);
  }

  // 检查头顶空间
  if (topSpaceRatio < 0.10) {
    issues.push(`头顶空间不足: ${(topSpaceRatio * 100).toFixed(1)}% (最小 10%)`);
  }
  if (topSpaceRatio > 0.25) {
    issues.push(`头顶空间过多: ${(topSpaceRatio * 100).toFixed(1)}% (最大 25%)`);
  }

  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      headHeightRatio,
      eyeYFromBottom,
      topSpaceRatio,
    },
  };
}
