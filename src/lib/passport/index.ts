/**
 * 护照标准模块导出
 */

export {
  PHOTO_DIMENSIONS,
  HEAD_SIZE_STANDARDS,
  EYES_POSITION_STANDARDS,
  TOP_SPACE_STANDARDS,
  POSE_STANDARDS,
  QUALITY_STANDARDS,
  BACKGROUND_STANDARDS,
} from './usPassportStandards';

export type {
  ComplianceCheckResult,
  FullComplianceResult,
} from './usPassportStandards';

export {
  smartCropForPassport,
  validateCropForPassport,
} from './passportCropper';

export type { CropArea } from './passportCropper';
