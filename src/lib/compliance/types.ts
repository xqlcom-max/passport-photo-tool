/**
 * 合规检测类型定义
 */

/** 检查项状态 */
export type CheckStatus = 'pass' | 'warning' | 'fail';

/** 单项检查结果 */
export interface CheckResult {
  /** 检查项名称 */
  name: string;
  /** 图标：✅/⚠️/❌ */
  icon: string;
  /** 状态 */
  status: CheckStatus;
  /** 描述信息 */
  message: string;
  /** 实际值（用于显示） */
  actualValue?: string;
  /** 期望值范围（用于显示） */
  expectedValue?: string;
}

/** 完整合规检测结果 */
export interface ComplianceResult {
  /** 所有检查项 */
  checks: CheckResult[];
  /** 总分（0-100） */
  score: number;
  /** 是否通过 */
  passed: boolean;
  /** 总体状态 */
  overallStatus: 'PASS' | 'FAIL';
}
