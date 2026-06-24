import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Take a Passport Photo at Home — Step by Step Guide',
  description: 'Learn how to take a compliant US passport photo at home with your smartphone. Tips for lighting, background, and positioning. Free online tool included.',
  openGraph: {
    title: 'How to Take a Passport Photo at Home',
    description: 'Step-by-step guide to taking compliant passport photos with your phone.',
    type: 'website',
  },
};

export default function HowToPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <h1 className="font-extrabold text-[32px] leading-tight mb-6">
        How to Take a Passport Photo at Home
      </h1>

      <p className="text-gray-600 mb-8 text-[15px] leading-relaxed">
        You don&apos;t need to visit a drugstore or photo studio. With a smartphone and our
        free AI tool, you can take a compliant US passport photo in under 2 minutes.
      </p>

      {/* 步骤 1 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">1</div>
          <h2 className="font-bold text-xl">Find the Right Location</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl ml-[52px]">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Stand 3-4 feet from a <strong>plain white wall</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Avoid windows directly behind you (causes shadows)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Good natural light from the front is ideal</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 步骤 2 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">2</div>
          <h2 className="font-bold text-xl">Prepare Your Appearance</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl ml-[52px]">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-red-500">✗</span>
              <span><strong>Remove glasses</strong> — even prescription glasses are not allowed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500">✗</span>
              <span><strong>No hats</strong> or head coverings (unless religious, with documentation)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Wear normal clothes — no uniforms</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Keep a <strong>neutral expression</strong> or natural smile</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 步骤 3 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">3</div>
          <h2 className="font-bold text-xl">Take the Photo</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl ml-[52px]">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Have someone else take the photo (selfies distort proportions)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Position camera at <strong>eye level</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Fill the frame — head should be 50-69% of image height</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Use your phone&apos;s rear camera (better quality)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 步骤 4 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">4</div>
          <h2 className="font-bold text-xl">Process with Our AI Tool</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl ml-[52px]">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Upload your photo to our tool</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>AI automatically removes background and crops to 2x2 inches</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Preview and adjust if needed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Download compliant passport photo</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4">💡 Pro Tips</h2>
        <div className="bg-amber-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span>📸</span>
              <span>Take multiple photos and pick the best one</span>
            </li>
            <li className="flex items-start gap-3">
              <span>💡</span>
              <span>Avoid using flash — it creates harsh shadows</span>
            </li>
            <li className="flex items-start gap-3">
              <span>🔍</span>
              <span>Check that both ears are visible</span>
            </li>
            <li className="flex items-start gap-3">
              <span>⏰</span>
              <span>Photos must be taken within the last 6 months</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 bg-emerald-50 rounded-2xl">
        <h2 className="font-bold text-xl mb-3">Ready to Create Your Passport Photo?</h2>
        <p className="text-gray-600 mb-6 text-[15px]">
          Upload your photo and let our AI tool handle the rest. Free preview, no signup required.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Start Now — It&apos;s Free
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
