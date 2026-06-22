'use client';

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="pt-20 pb-14 text-center">
      <div className="max-w-[640px] mx-auto px-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[13px] font-semibold mb-6">
          <span className="text-base">🇺🇸</span>
          US Passport Photo Tool
        </div>
        <h1 className="font-extrabold text-[clamp(32px,6vw,48px)] leading-[1.1] tracking-[-1.5px] mb-4">
          Your US passport photo,<br/>
          <span className="text-emerald-600">done right.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-[420px] mx-auto mb-8 leading-relaxed">
          Upload a photo. We crop, resize, and format it to meet US State Department passport requirements. No drugstore trips needed.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 text-white border-none rounded-xl text-base font-semibold shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          Get Started — It&apos;s Free
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
