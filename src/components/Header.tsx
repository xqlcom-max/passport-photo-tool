'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/85 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-[640px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="12" cy="10" r="3"/>
              <path d="M7 21v-1a5 5 0 0 1 10 0v1"/>
            </svg>
          </div>
          <span className="font-extrabold text-[17px] tracking-tight">Passport Photo Tool</span>
        </Link>
        <nav className="flex gap-6">
          <a href="#how" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
