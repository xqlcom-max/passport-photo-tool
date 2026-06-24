'use client';

interface PreviewProps {
  originalDataUrl: string;
  processedDataUrl: string;
  watermarkedDataUrl: string;
  onBgChange: (bg: 'white' | 'blue') => void;
  currentBg: 'white' | 'blue';
  onFreeDownload: () => void;
  onPaidDownload: () => void;
}

export default function Preview({
  originalDataUrl,
  processedDataUrl,
  watermarkedDataUrl,
  onBgChange,
  currentBg,
  onFreeDownload,
  onPaidDownload,
}: PreviewProps) {
  return (
    <section className="pb-12 animate-[fadeInUp_0.5s_ease]">
      <div className="max-w-[640px] mx-auto px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl">Your US Passport Photo</h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-full text-[13px] font-semibold animate-[badgePop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            US Standard 2×2" (51×51mm)
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Original</p>
            <img className="w-48 h-48 object-cover rounded-xl border border-gray-200" src={originalDataUrl} alt="Original photo" />
          </div>
          <span className="text-gray-400 text-2xl flex-shrink-0">&rarr;</span>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">🇺🇸 US Passport</p>
            {/* 带裁剪框 guide 的预览图 - 2x2 英寸（51mm × 51mm）正方形 */}
            <div className="relative w-48 h-48 rounded-xl border-2 border-emerald-600 shadow-[0_0_0_4px_rgba(236,253,245,1)] overflow-hidden">
              <img className="w-full h-full object-cover" src={watermarkedDataUrl || processedDataUrl} alt="US Passport photo" />
              {/* 2x2 裁剪框 guide */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 顶部 20% 安全区域（头顶空间） */}
                <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-black/10 to-transparent" />
                {/* 头部比例 guide（50-69%） */}
                <div className="absolute top-[15%] left-0 right-0 h-[55%] border-t border-b border-dashed border-white/60" />
                {/* 眼睛位置 guide（56-69%） */}
                <div className="absolute top-[45%] left-0 right-0 h-[24%] border-t border-dashed border-emerald-300/80" />
                {/* 比例标注 */}
                <div className="absolute top-[20%] right-1 text-[8px] text-white/80 bg-black/30 px-1 rounded">Top</div>
                <div className="absolute top-[48%] right-1 text-[8px] text-white/80 bg-black/30 px-1 rounded">Eyes</div>
                <div className="absolute bottom-[10%] right-1 text-[8px] text-white/80 bg-black/30 px-1 rounded">Chin</div>
              </div>
            </div>
          </div>
        </div>

        {/* 合规检查提示 */}
        <div className="flex items-center justify-center gap-4 mb-6 text-[12px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>2×2 inch (51×51mm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>White background</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>Head 50-69%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>300 DPI print ready</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 mb-6">
          <div className="flex items-center gap-3 justify-center">
            <span className="text-[13px] font-medium text-gray-500">Background:</span>
            <button
              className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-all relative ${
                currentBg === 'white'
                  ? 'border-emerald-600 shadow-[0_0_0_3px_rgba(236,253,245,1)]'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ background: '#FFFFFF' }}
              title="White background — US Passport required"
              onClick={() => onBgChange('white')}
            >
              {currentBg === 'white' && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-600">✓</span>}
            </button>
            <button
              className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-all relative ${
                currentBg === 'blue'
                  ? 'border-emerald-600 shadow-[0_0_0_3px_rgba(236,253,245,1)]'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ background: '#438EDB' }}
              title="Blue background — Not for US Passport"
              onClick={() => onBgChange('blue')}
            >
              {currentBg === 'blue' && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">✓</span>}
            </button>
          </div>
          {currentBg === 'blue' && (
            <p className="text-[11px] text-amber-600 font-medium">⚠️ Blue background does not meet US passport requirements. US passport requires plain white background.</p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-900 border-[1.5px] border-gray-200 rounded-xl text-[15px] font-semibold w-full hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
            onClick={onFreeDownload}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Free (2x2" 300 DPI)
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white border-none rounded-xl text-[15px] font-semibold w-full shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            onClick={onPaidDownload}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Remove Watermark (HD 300 DPI) — $2.99
          </button>
        </div>
      </div>
    </section>
  );
}
