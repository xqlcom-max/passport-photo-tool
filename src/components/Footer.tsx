import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 text-center">
      <div className="max-w-[640px] mx-auto px-6">
        <p className="text-[13px] text-gray-400">&copy; 2025 Passport Photo Tool. All rights reserved.</p>
        <div className="flex justify-center gap-5 mt-2">
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
      </div>
    </footer>
  );
}
