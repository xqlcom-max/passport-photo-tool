'use client';

export default function BeforeAfter() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[640px] mx-auto px-6">
        <h2 className="font-extrabold text-2xl text-center mb-3 tracking-[-0.5px]">
          See the Difference
        </h2>
        <p className="text-center text-gray-500 mb-10 text-[15px]">
          Original photo → AI-processed passport photo
        </p>

        {/* 对比展示区 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* 原始照片 */}
          <div className="flex-1 max-w-[192px]">
            <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden border-2 border-gray-200">
              <img
                src="/original-photo.jpg"
                alt="Original selfie photo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-[13px] text-gray-500 mt-2 font-medium">Original Photo</p>
          </div>

          {/* 箭头 */}
          <div className="flex flex-col items-center text-emerald-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-[11px] text-gray-400 mt-1">AI Crop</span>
          </div>

          {/* 处理后照片 */}
          <div className="flex-1 max-w-[192px]">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-md">
              <img
                src="/passport-photo.png"
                alt="AI processed passport photo"
                className="w-full h-full object-cover"
              />
              {/* 2x2 裁剪框提示 */}
              <div className="absolute inset-2 border border-dashed border-emerald-300 rounded-lg pointer-events-none" />
            </div>
            <p className="text-center text-[13px] text-emerald-600 mt-2 font-semibold">2x2 Passport Photo</p>
          </div>
        </div>

        {/* 信任背书 */}
        <div className="flex justify-center gap-6 mt-8 text-[13px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>Official Guidelines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>AI Processed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span>
            <span>Instant Results</span>
          </div>
        </div>
      </div>
    </section>
  );
}
