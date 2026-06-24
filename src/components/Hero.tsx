'use client';

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="pt-20 pb-14 text-center">
      <div className="max-w-[640px] mx-auto px-6">
        {/* 官方标准标识 */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[13px] font-semibold mb-6">
          <span className="text-base">🇺🇸</span>
          Based on US State Department Requirements
        </div>

        <h1 className="font-extrabold text-[clamp(32px,6vw,48px)] leading-[1.1] tracking-[-1.5px] mb-4">
          US Passport Photo Maker<br/>
          <span className="text-emerald-600">2x2 inches • AI-Powered</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-[420px] mx-auto mb-6 leading-relaxed">
          Upload a photo. We crop, resize, and format it to meet US State Department passport requirements. No drugstore trips needed.
        </p>

        {/* 官方标准快速预览 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 text-[13px] text-gray-500">
          <span className="px-2.5 py-1 bg-gray-50 rounded-full">2x2 inches (51x51mm)</span>
          <span className="px-2.5 py-1 bg-gray-50 rounded-full">600x600 px minimum</span>
          <span className="px-2.5 py-1 bg-gray-50 rounded-full">White background</span>
          <span className="px-2.5 py-1 bg-gray-50 rounded-full">Face 50-69%</span>
        </div>

        {/* 改进的 CTA 按钮 - 明确区分免费和付费 */}
        <div className="mb-6">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white border-none rounded-xl text-base font-semibold shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Try Free Preview
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <p className="text-[13px] text-gray-400 mt-2">
            Free preview • HD download: $2.99 • No watermark on paid version
          </p>
        </div>

        {/* 隐私说明 - 关键信任元素 */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-[13px] text-gray-600">
          <span className="text-emerald-500">🔒</span>
          <span>
            <strong>Privacy First:</strong> Your photo never leaves your device. All processing happens in your browser.
          </span>
        </div>
      </div>
    </section>
  );
}
