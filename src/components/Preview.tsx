'use client';

interface PreviewProps {
  originalDataUrl: string;
  processedDataUrl: string;
  onBgChange: (bg: 'white' | 'blue') => void;
  currentBg: 'white' | 'blue';
  onFreeDownload: () => void;
  onPaidDownload: () => void;
}

export default function Preview({
  originalDataUrl,
  processedDataUrl,
  onBgChange,
  currentBg,
  onFreeDownload,
  onPaidDownload,
}: PreviewProps) {
  return (
    <section className="pb-12 animate-[fadeInUp_0.5s_ease]">
      <div className="max-w-[640px] mx-auto px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl">Your Passport Photo</h2>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-full text-[13px] font-semibold animate-[badgePop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Correct Size &amp; Format
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Original</p>
            <img className="w-32 h-40 object-cover rounded-xl border border-gray-200" src={originalDataUrl} alt="Original photo" />
          </div>
          <span className="text-gray-400 text-2xl flex-shrink-0">&rarr;</span>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Passport Photo</p>
            <img className="w-32 h-40 object-cover rounded-xl border-2 border-emerald-600 shadow-[0_0_0_4px_rgba(236,253,245,1)]" src={processedDataUrl} alt="Passport photo" />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center mb-6">
          <span className="text-[13px] font-medium text-gray-500">Background:</span>
          <button
            className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-all relative ${
              currentBg === 'white'
                ? 'border-emerald-600 shadow-[0_0_0_3px_rgba(236,253,245,1)]'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ background: '#FFFFFF' }}
            title="White background"
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
            title="Blue background"
            onClick={() => onBgChange('blue')}
          >
            {currentBg === 'blue' && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">✓</span>}
          </button>
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
            Download Free (with watermark)
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white border-none rounded-xl text-[15px] font-semibold w-full shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            onClick={onPaidDownload}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Remove Watermark — $2.99
          </button>
        </div>
      </div>
    </section>
  );
}
