/**
 * 姿态检测项
 */

import type { FaceDetectionResult } from '../face/types';
import type { CheckResult } from './types';
import { POSE_STANDARDS } from '../passport/usPassportStandards';

/**
 * 检查头部姿态（歪头/低头/抬头/转头）
 */
export function checkHeadPose(
  detection: FaceDetectionResult
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!detection.headRotation) {
    results.push({
      name: 'Head Pose',
      icon: '⚠️',
      status: 'warning',
      message: '无法检测头部姿态',
    });
    return results;
  }

  const { pitch, yaw, roll } = detection.headRotation;

  // 检查歪头（roll）
  const rollCheck = checkAngle(
    'Head Straight (No Tilt)',
    roll,
    POSE_STANDARDS.maxRoll,
    '歪头'
  );
  results.push(rollCheck);

  // 检查低头/抬头（pitch）
  const pitchCheck = checkAngle(
    'Head Upright',
    pitch,
    POSE_STANDARDS.maxPitch,
    '低头/抬头'
  );
  results.push(pitchCheck);

  // 检查左右转头（yaw）
  const yawCheck = checkAngle(
    'Face Forward',
    yaw,
    POSE_STANDARDS.maxYaw,
    '左/右转头'
  );
  results.push(yawCheck);

  return results;
}

/**
 * 检查单个角度
 */
function checkAngle(
  name: string,
  angle: number,
  maxAngle: number,
  description: string
): CheckResult {
  const absAngle = Math.abs(angle);

  if (absAngle <= maxAngle * 0.7) {
    return {
      name,
      icon: '✅',
      status: 'pass',
      message: `${description}正常`,
      actualValue: `${angle.toFixed(1)}°`,
      expectedValue: `±${maxAngle}°`,
    };
  }

  if (absAngle <= maxAngle) {
    return {
      name,
      icon: '⚠️',
      status: 'warning',
      message: `${description}略${angle > 0 ? '多' : '少'}`,
      actualValue: `${angle.toFixed(1)}°`,
      expectedValue: `±${maxAngle}°`,
    };
  }

  return {
    name,
    icon: '❌',
    status: 'fail',
    message: `${description}过多，请调整姿势`,
    actualValue: `${angle.toFixed(1)}°`,
    expectedValue: `±${maxAngle}°`,
  };
}
