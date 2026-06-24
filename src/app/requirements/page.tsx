import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'US Passport Photo Requirements 2026 — Complete Guide',
  description: 'Official US passport photo requirements for 2026. Size, background, face ratio, and formatting rules explained. Free online tool to create compliant photos.',
  openGraph: {
    title: 'US Passport Photo Requirements 2026',
    description: 'Official US passport photo requirements. Size, background, face ratio rules.',
    type: 'website',
  },
};

export default function RequirementsPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <h1 className="font-extrabold text-[32px] leading-tight mb-6">
        US Passport Photo Requirements 2026
      </h1>

      <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">
        The US Department of State has strict requirements for passport photos. Your application
        will be rejected if the photo doesn&apos;t meet these standards. Below is the complete
        list of requirements for 2026.
      </p>

      {/* 核心尺寸要求 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4 text-emerald-600">📐 Size Requirements</h2>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Dimensions:</strong> 2 x 2 inches (51 x 51 mm)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Resolution:</strong> Minimum 600 x 600 pixels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Aspect ratio:</strong> Must be square (1:1)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>File format:</strong> JPEG (.jpg) recommended</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 背景和颜色 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4 text-emerald-600">🎨 Background & Color</h2>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Background color:</strong> White or off-white</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Photo quality:</strong> In color, taken within last 6 months</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Lighting:</strong> Even lighting, no shadows on face or background</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 面部要求 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4 text-emerald-600">👤 Face Requirements</h2>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Head size:</strong> 50% to 69% of total image height</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Eye position:</strong> 56% to 69% from bottom of photo</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Expression:</strong> Neutral facial expression or natural smile</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Eyes:</strong> Open and clearly visible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Headphones:</strong> Not allowed</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 着装和配饰 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4 text-emerald-600">👔 Clothing & Accessories</h2>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5">✗</span>
              <span><strong>Glasses:</strong> Not allowed (even prescription glasses)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5">✗</span>
              <span><strong>Hats/head coverings:</strong> Not allowed (religious exceptions require documentation)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Uniforms:</strong> Not allowed (civilian clothing required)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span><strong>Background:</strong> Plain white or off-white only</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 常见被拒原因 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4 text-emerald-600">⚠️ Common Reasons for Rejection</h2>
        <div className="bg-red-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Photo is blurry or low resolution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Face is too small or too large</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Background is not white/off-white</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Shadows on face or background</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Glasses or head coverings (non-religious)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">❌</span>
              <span>Photo is not square (2x2 inches)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 bg-emerald-50 rounded-2xl">
        <h2 className="font-bold text-xl mb-3">Create Your Passport Photo Now</h2>
        <p className="text-gray-600 mb-6 text-[15px]">
          Our AI tool automatically crops, resizes, and formats your photo to meet all US passport requirements.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Try Free Preview
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
