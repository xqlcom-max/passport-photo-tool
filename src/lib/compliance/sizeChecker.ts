/**
 * 头部尺寸检测项
 */

import type { FaceDetectionResult, FaceMetrics } from '../face/types';
import type { CheckResult } from './types';
import { HEAD_SIZE_STANDARDS, EYES_POSITION_STANDARDS } from '../passport/usPassportStandards';

/**
 * 检查头部高度比例
 */
export function checkHeadSize(
  metrics: FaceMetrics
): CheckResult {
  const ratio = metrics.headHeightRatio;
  const min = HEAD_SIZE_STANDARDS.minHeightRatio;
  const max = HEAD_SIZE_STANDARDS.maxHeightRatio;
  const recommended = HEAD_SIZE_STANDARDS.recommendedHeightRatio;

  if (ratio >= min && ratio <= max) {
    // 检查是否接近推荐值
    const diff = Math.abs(ratio - recommended);
    if (diff <= 0.05) {
      return {
        name: 'Head Size',
        icon: '✅',
        status: 'pass',
        message: '头部大小符合标准',
        actualValue: `${(ratio * 100).toFixed(1)}%`,
        expectedValue: `${(min * 100)}%-${(max * 100)}%`,
      };
    }
    return {
      name: 'Head Size',
      icon: '⚠️',
      status: 'warning',
      message: '头部大小在允许范围内，但不是最佳',
      actualValue: `${(ratio * 100).toFixed(1)}%`,
      expectedValue: `推荐 ${(recommended * 100)}%`,
    };
  }

  if (ratio < min) {
    return {
      name: 'Head Size',
      icon: '❌',
      status: 'fail',
      message: '头部太小，请使用更近距离拍摄的照片',
      actualValue: `${(ratio * 100).toFixed(1)}%`,
      expectedValue: `${(min * 100)}%-${(max * 100)}%`,
    };
  }

  return {
    name: 'Head Size',
    icon: '❌',
    status: 'fail',
    message: '头部太大，请使用更远距离拍摄的照片',
    actualValue: `${(ratio * 100).toFixed(1)}%`,
    expectedValue: `${(min * 100)}%-${(max * 100)}%`,
  };
}

/**
 * 检查眼睛位置
 */
export function checkEyesPosition(
  metrics: FaceMetrics
): CheckResult {
  const ratio = metrics.eyesYFromBottom;
  const min = EYES_POSITION_STANDARDS.minYFromBottom;
  const max = EYES_POSITION_STANDARDS.maxYFromBottom;
  const recommended = EYES_POSITION_STANDARDS.recommendedYFromBottom;

  if (ratio >= min && ratio <= max) {
    const diff = Math.abs(ratio - recommended);
    if (diff <= 0.04) {
      return {
        name: 'Eyes Position',
        icon: '✅',
        status: 'pass',
        message: '眼睛位置符合标准',
        actualValue: `${(ratio * 100).toFixed(1)}%`,
        expectedValue: `${(min * 100)}%-${(max * 100)}%`,
      };
    }
    return {
      name: 'Eyes Position',
      icon: '⚠️',
      status: 'warning',
      message: '眼睛位置在允许范围内，但不是最佳',
      actualValue: `${(ratio * 100).toFixed(1)}%`,
      expectedValue: `推荐 ${(recommended * 100)}%`,
    };
  }

  if (ratio < min) {
    return {
      name: 'Eyes Position',
      icon: '❌',
      status: 'fail',
      message: '眼睛位置太低，请向上调整',
      actualValue: `${(ratio * 100).toFixed(1)}%`,
      expectedValue: `${(min * 100)}%-${(max * 100)}%`,
    };
  }

  return {
    name: 'Eyes Position',
    icon: '❌',
    status: 'fail',
    message: '眼睛位置太高，请向下调整',
    actualValue: `${(ratio * 100).toFixed(1)}%`,
    expectedValue: `${(min * 100)}%-${(max * 100)}%`,
  };
}

/**
 * 检查人脸是否居中
 */
export function checkFaceCentered(
  metrics: FaceMetrics
): CheckResult {
  const offsetX = Math.abs(metrics.centerOffsetX);
  const offsetY = Math.abs(metrics.centerOffsetY);

  // 允许的最大偏移量（20%）
  const maxOffset = 0.20;

  if (offsetX <= maxOffset && offsetY <= maxOffset) {
    if (offsetX <= 0.05 && offsetY <= 0.05) {
      return {
        name: 'Face Centered',
        icon: '✅',
        status: 'pass',
        message: '人脸居中',
      };
    }
    return {
      name: 'Face Centered',
      icon: '⚠️',
      status: 'warning',
      message: '人脸略微偏离中心',
      actualValue: `X: ${(offsetX * 100).toFixed(1)}%, Y: ${(offsetY * 100).toFixed(1)}%`,
    };
  }

  return {
    name: 'Face Centered',
    icon: '❌',
    status: 'fail',
    message: '人脸偏离中心过多',
    actualValue: `X: ${(offsetX * 100).toFixed(1)}%, Y: ${(offsetY * 100).toFixed(1)}%`,
  };
}
