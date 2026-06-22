/**
 * 合规检测模块导出
 */

export { runComplianceCheck } from './complianceChecker';
export { checkFaceDetected, checkFaceSize } from './faceChecker';
export { checkHeadPose } from './poseChecker';
export { checkHeadSize, checkEyesPosition, checkFaceCentered } from './sizeChecker';
export { checkBlur, checkBrightness, checkContrast } from './qualityChecker';
export { checkBackground, checkShadows } from './backgroundChecker';

export type { CheckResult, ComplianceResult, CheckStatus } from './types';
