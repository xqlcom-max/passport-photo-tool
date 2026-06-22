/**
 * 美国护照照片官方标准参数
 *
 * 参考来源：
 * - https://travel.state.gov/content/travel/en/passports/need-passport/photo.html
 * - https://www.ecfr.gov/current/title-22/chapter-I/part-51/subpart-B/section-51.22
 */

/** 护照照片尺寸标准 */
export const PHOTO_DIMENSIONS = {
  /** 照片宽度（像素） */
  width: 600,
  /** 照片高度（像素） */
  height: 600,
  /** 照片尺寸（英寸） */
  inches: 2,
  /** DPI */
  dpi: 300,
} as const;

/** 头部尺寸标准 */
export const HEAD_SIZE_STANDARDS = {
  /** 头部最小高度比例（占照片高度） */
  minHeightRatio: 0.50,
  /** 头部最大高度比例（占照片高度） */
  maxHeightRatio: 0.69,
  /** 推荐头部高度比例 */
  recommendedHeightRatio: 0.58,
  /** 最小头部宽度比例（占照片宽度） */
  minWidthRatio: 0.25,
  /** 最大头部宽度比例（占照片宽度） */
  maxWidthRatio: 0.65,
} as const;

/** 眼睛位置标准 */
export const EYES_POSITION_STANDARDS = {
  /** 眼睛距底部最小比例 */
  minYFromBottom: 0.56,
  /** 眼睛距底部最大比例 */
  maxYFromBottom: 0.69,
  /** 推荐眼睛距底部比例 */
  recommendedYFromBottom: 0.62,
  /** 眼睛距顶部最小比例（确保头顶空间） */
  minYFromTop: 0.30,
  /** 眼睛距顶部最大比例 */
  maxYFromTop: 0.45,
} as const;

/** 头顶空间标准 */
export const TOP_SPACE_STANDARDS = {
  /** 最小头顶空间比例 */
  minHeightRatio: 0.10,
  /** 最大头顶空间比例 */
  maxHeightRatio: 0.25,
  /** 推荐头顶空间比例 */
  recommendedHeightRatio: 0.15,
} as const;

/** 姿态标准 */
export const POSE_STANDARDS = {
  /** 最大俯仰角（低头/抬头）- 度 */
  maxPitch: 10,
  /** 最大偏航角（左右转头）- 度 */
  maxYaw: 10,
  /** 最大翻滚角（歪头）- 度 */
  maxRoll: 10,
} as const;

/** 图片质量标准 */
export const QUALITY_STANDARDS = {
  /** 最小模糊阈值（Laplacian 方差，越大越清晰） */
  minBlurThreshold: 100,
  /** 最小亮度（0-255） */
  minBrightness: 50,
  /** 最大亮度（0-255） */
  maxBrightness: 220,
  /** 最小对比度 */
  minContrast: 20,
} as const;

/** 背景标准 */
export const BACKGROUND_STANDARDS = {
  /** 背景白色阈值（RGB 各通道最小值） */
  whiteThreshold: 200,
  /** 背景均匀性阈值（标准差） */
  maxColorVariance: 30,
} as const;

/**
 * 合规检测结果类型
 */
export interface ComplianceCheckResult {
  /** 检查项名称 */
  name: string;
  /** 是否通过 */
  passed: boolean;
  /** 状态：pass/warning/fail */
  status: 'pass' | 'warning' | 'fail';
  /** 描述信息 */
  message: string;
  /** 实际值 */
  actualValue?: number | string;
  /** 期望值 */
  expectedValue?: string;
}

/**
 * 完整合规检测结果
 */
export interface FullComplianceResult {
  /** 所有检查项 */
  checks: ComplianceCheckResult[];
  /** 总分（0-100） */
  score: number;
  /** 是否通过 */
  passed: boolean;
  /** 总体状态 */
  overallStatus: 'PASS' | 'FAIL';
}
