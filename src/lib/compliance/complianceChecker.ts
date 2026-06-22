/**
 * 合规检测主模块
 *
 * 整合所有检测项，计算总分，给出 PASS/FAIL 判断
 */

import type { FaceDetectionResult, FaceMetrics } from '../face/types';
import type { CheckResult, ComplianceResult } from './types';
import { checkFaceDetected, checkFaceSize } from './faceChecker';
import { checkHeadPose } from './poseChecker';
import { checkHeadSize, checkEyesPosition, checkFaceCentered } from './sizeChecker';
import { checkBlur, checkBrightness, checkContrast } from './qualityChecker';
import { checkBackground, checkShadows } from './backgroundChecker';

/** 检查项权重（用于计算总分） */
const CHECK_WEIGHTS: Record<string, number> = {
  'Face Detected': 20,
  'Face Size': 5,
  'Head Straight (No Tilt)': 10,
  'Head Upright': 10,
  'Face Forward': 10,
  'Head Size': 15,
  'Eyes Position': 15,
  'Face Centered': 5,
  'Image Sharpness': 5,
  'Brightness': 5,
  'Contrast': 0,  // 仅警告，不影响分数
  'Background Color': 0,  // 会自动去背景
  'Shadows': 0,  // 会自动去背景
};

/**
 * 执行完整的合规检测
 *
 * @param detection - 人脸检测结果
 * @param metrics - 人脸指标（可选，如果已计算）
 * @param image - 原始图片（用于质量检测）
 * @param imageWidth - 图片宽度
 * @param imageHeight - 图片高度
 * @returns 合规检测结果
 */
export function runComplianceCheck(
  detection: FaceDetectionResult,
  metrics: FaceMetrics | null,
  image: HTMLImageElement | HTMLCanvasElement,
  imageWidth: number,
  imageHeight: number
): ComplianceResult {
  const checks: CheckResult[] = [];

  // 1. 人脸检测
  checks.push(checkFaceDetected(detection));

  // 2. 人脸大小
  if (detection.detected) {
    checks.push(checkFaceSize(detection, imageWidth, imageHeight));
  }

  // 3. 姿态检测
  if (detection.detected) {
    checks.push(...checkHeadPose(detection));
  }

  // 4. 尺寸检测（需要 metrics）
  if (metrics) {
    checks.push(checkHeadSize(metrics));
    checks.push(checkEyesPosition(metrics));
    checks.push(checkFaceCentered(metrics));
  }

  // 5. 质量检测
  checks.push(checkBlur(image));
  checks.push(checkBrightness(image));
  checks.push(checkContrast(image));

  // 6. 背景检测
  checks.push(checkBackground(image));
  checks.push(checkShadows(image));

  // 计算总分
  const score = calculateScore(checks);

  // 判断是否通过（80 分以上）
  const passed = score >= 80;

  return {
    checks,
    score,
    passed,
    overallStatus: passed ? 'PASS' : 'FAIL',
  };
}

/**
 * 计算总分
 * 根据检查项的权重和状态计算
 */
function calculateScore(checks: CheckResult[]): number {
  let totalScore = 100;

  for (const check of checks) {
    const weight = CHECK_WEIGHTS[check.name] || 0;

    if (check.status === 'fail') {
      totalScore -= weight;
    } else if (check.status === 'warning') {
      totalScore -= weight * 0.3; // 警告扣 30% 的分
    }
  }

  return Math.max(0, Math.min(100, Math.round(totalScore)));
}
