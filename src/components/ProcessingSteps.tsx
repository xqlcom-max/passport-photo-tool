'use client';

/** 处理步骤状态 */
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

/** 单个处理步骤 */
export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
}

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export default function ProcessingSteps({ steps }: ProcessingStepsProps) {
  const activeStep = steps.find(s => s.status === 'active');
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="max-w-md mx-auto my-8">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Processing...</span>
          <span>{completedCount}/{steps.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <StepItem key={step.id} step={step} index={index} />
        ))}
      </div>

      {/* 当前步骤提示 */}
      {activeStep && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="font-medium">{activeStep.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StepItem({ step, index }: { step: ProcessingStep; index: number }) {
  const icon = {
    pending: (
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-400">{index + 1}</span>
      </div>
    ),
    active: (
      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    ),
    completed: (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  }[step.status];

  const textColor = {
    pending: 'text-gray-500',
    active: 'text-blue-600 font-medium',
    completed: 'text-green-600',
    error: 'text-red-600',
  }[step.status];

  return (
    <div className={`flex items-center gap-3 ${textColor}`}>
      {icon}
      <div className="flex-1">
        <div className="text-sm">{step.name}</div>
      </div>
    </div>
  );
}
