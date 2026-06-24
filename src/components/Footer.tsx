import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 text-center">
      <div className="max-w-[640px] mx-auto px-6">
        {/* SEO 页面链接 */}
        <div className="flex justify-center gap-5 mb-4">
          <Link href="/requirements" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            Photo Requirements
          </Link>
          <Link href="/how-to" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            How to Take Photo
          </Link>
          <Link href="/faq" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            FAQ
          </Link>
        </div>

        {/* 法律页面链接 */}
        <div className="flex justify-center gap-5 mb-3">
          <Link href="/privacy" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            Terms of Service
          </Link>
          <Link href="/refund" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            Refund Policy
          </Link>
          <a href="mailto:support@passportphototool.com" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
            Contact
          </a>
        </div>

        <p className="text-[13px] text-gray-400">&copy; 2026 Passport Photo Tool. All rights reserved.</p>
      </div>
    </footer>
  );
}
