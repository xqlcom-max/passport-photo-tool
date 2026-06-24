import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Passport Photo FAQ — Common Questions Answered',
  description: 'Answers to common passport photo questions: glasses, background, size, rejection reasons. Get your US passport photo right the first time.',
  openGraph: {
    title: 'Passport Photo FAQ',
    description: 'Common passport photo questions answered.',
    type: 'website',
  },
};

const faqs = [
  {
    question: 'Will my passport photo be accepted?',
    answer: 'Our AI tool automatically crops, resizes, and formats your photo to meet all US State Department requirements. The tool checks head size, eye position, and background color. As long as your original photo is clear and well-lit, the processed photo should be accepted.',
  },
  {
    question: 'How strict are passport photo rules?',
    answer: 'Very strict. The US State Department will reject photos that don\'t meet exact specifications: 2x2 inches, white background, proper head size (50-69% of image), and no glasses. Even small issues like shadows or tilted heads can cause rejection.',
  },
  {
    question: 'Can I wear glasses in my passport photo?',
    answer: 'No. Since 2016, the US State Department no longer allows glasses in passport photos, even prescription glasses. You must remove them before taking your photo.',
  },
  {
    question: 'What background color is required?',
    answer: 'The background must be plain white or off-white. Our AI tool automatically detects and replaces the background with the correct white color.',
  },
  {
    question: 'What size should the photo be?',
    answer: 'US passport photos must be exactly 2 x 2 inches (51 x 51 mm). The resolution must be at least 600 x 600 pixels. Our tool automatically resizes to the correct dimensions.',
  },
  {
    question: 'How recent does the photo need to be?',
    answer: 'The photo must have been taken within the last 6 months. This is a strict requirement — older photos will be rejected.',
  },
  {
    question: 'Can I take a selfie for my passport photo?',
    answer: 'Technically yes, but it\'s not recommended. Selfies often distort facial proportions and create unflattering angles. Having someone else take the photo at eye level produces much better results.',
  },
  {
    question: 'What if my photo is rejected?',
    answer: 'If your passport application is rejected due to photo issues, you\'ll need to resubmit with a new photo. Our tool helps avoid this by automatically formatting to meet all requirements.',
  },
  {
    question: 'Is my photo stored on your servers?',
    answer: 'No. All processing happens in your browser. Your photo never leaves your device and is never uploaded to our servers. This ensures complete privacy.',
  },
  {
    question: 'Can I use this for visa photos too?',
    answer: 'Our tool is optimized for US passport photos. Many countries have different requirements for visa photos. Check the specific requirements for your destination country.',
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      <h1 className="font-extrabold text-[32px] leading-tight mb-6">
        Passport Photo FAQ
      </h1>

      <p className="text-gray-600 mb-10 text-[15px] leading-relaxed">
        Got questions about passport photos? We&apos;ve compiled answers to the most common
        questions about US passport photo requirements and our tool.
      </p>

      {/* FAQ 列表 */}
      <div className="space-y-6 mb-12">
        {faqs.map((faq, index) => (
          <section key={index} className="bg-gray-50 p-6 rounded-2xl">
            <h2 className="font-bold text-lg mb-3 text-emerald-700">{faq.question}</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed">{faq.answer}</p>
          </section>
        ))}
      </div>

      {/* 补充信息 */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4">📋 Quick Checklist</h2>
        <div className="bg-emerald-50 p-6 rounded-2xl">
          <ul className="space-y-3 text-[15px]">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Photo taken within last 6 months</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>2 x 2 inches (51 x 51 mm)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>White or off-white background</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>No glasses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Neutral expression</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500">✓</span>
              <span>Both eyes open and visible</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-8 bg-emerald-50 rounded-2xl">
        <h2 className="font-bold text-xl mb-3">Still Have Questions?</h2>
        <p className="text-gray-600 mb-6 text-[15px]">
          Try our free tool and see how easy it is to create a compliant passport photo.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Create Your Passport Photo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
