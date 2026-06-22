'use client';

import type { ComplianceResult, CheckResult } from '@/lib/compliance/types';

interface CompliancePanelProps {
  result: ComplianceResult | null;
  isVisible: boolean;
}

export default function CompliancePanel({ result, isVisible }: CompliancePanelProps) {
  if (!isVisible || !result) return null;

  const passedCount = result.checks.filter(c => c.status === 'pass').length;
  const warningCount = result.checks.filter(c => c.status === 'warning').length;
  const failCount = result.checks.filter(c => c.status === 'fail').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Passport Compliance
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
          result.overallStatus === 'PASS'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {result.overallStatus}
        </div>
      </div>

      {/* 分数 */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">{result.score}</span>
          <span className="text-lg text-gray-500">/ 100</span>
        </div>
        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {passedCount} passed · {warningCount} warnings · {failCount} failed
        </div>
      </div>

      {/* 检查项列表 */}
      <div className="space-y-3">
        {result.checks.map((check, index) => (
          <CheckItem key={`${check.name}-${index}`} check={check} />
        ))}
      </div>

      {/* 提示信息 */}
      {result.overallStatus === 'FAIL' && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>提示：</strong>照片未通过自动检测。系统会自动去背景并调整头部比例，
            但建议您根据上方提示重新拍摄，以获得最佳效果。
          </p>
        </div>
      )}
    </div>
  );
}

function CheckItem({ check }: { check: CheckResult }) {
  const bgColor = {
    pass: 'bg-green-50 border-green-100',
    warning: 'bg-amber-50 border-amber-100',
    fail: 'bg-red-50 border-red-100',
  }[check.status];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor}`}>
      <span className="text-lg flex-shrink-0">{check.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{check.name}</span>
          {check.actualValue && (
            <span className="text-xs text-gray-500">{check.actualValue}</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{check.message}</p>
        {check.expectedValue && (
          <p className="text-xs text-gray-400 mt-0.5">期望: {check.expectedValue}</p>
        )}
      </div>
    </div>
  );
}
