/**
 * 人脸检测项
 */

import type { FaceDetectionResult } from '../face/types';
import type { CheckResult } from './types';

/**
 * 检查是否检测到人脸
 */
export function checkFaceDetected(
  detection: FaceDetectionResult
): CheckResult {
  if (!detection.detected) {
    return {
      name: 'Face Detected',
      icon: '❌',
      status: 'fail',
      message: '未检测到人脸，请上传包含清晰人脸的照片',
    };
  }

  if (detection.faceCount > 1) {
    return {
      name: 'Face Detected',
      icon: '⚠️',
      status: 'warning',
      message: `检测到 ${detection.faceCount} 张人脸，将使用最大的一张`,
      actualValue: `${detection.faceCount} faces`,
      expectedValue: '1 face',
    };
  }

  return {
    name: 'Face Detected',
    icon: '✅',
    status: 'pass',
    message: '成功检测到人脸',
  };
}

/**
 * 检查人脸是否足够大
 */
export function checkFaceSize(
  detection: FaceDetectionResult,
  imageWidth: number,
  imageHeight: number
): CheckResult {
  if (!detection.detected || !detection.boundingBox) {
    return {
      name: 'Face Size',
      icon: '❌',
      status: 'fail',
      message: '无法检测人脸大小',
    };
  }

  const faceArea = detection.boundingBox.width * detection.boundingBox.height;
  const imageArea = imageWidth * imageHeight;
  const faceRatio = faceArea / imageArea;

  // 人脸应占图片面积的 10%-80%
  if (faceRatio < 0.10) {
    return {
      name: 'Face Size',
      icon: '❌',
      status: 'fail',
      message: '人脸太小，请使用更近距离拍摄的照片',
      actualValue: `${(faceRatio * 100).toFixed(1)}%`,
      expectedValue: '10%-80%',
    };
  }

  if (faceRatio > 0.80) {
    return {
      name: 'Face Size',
      icon: '⚠️',
      status: 'warning',
      message: '人脸可能太近，建议适当拉远',
      actualValue: `${(faceRatio * 100).toFixed(1)}%`,
      expectedValue: '10%-80%',
    };
  }

  return {
    name: 'Face Size',
    icon: '✅',
    status: 'pass',
    message: '人脸大小合适',
    actualValue: `${(faceRatio * 100).toFixed(1)}%`,
  };
}
