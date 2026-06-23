'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * 支付成功页面
 *
 * Gumroad 支付完成后重定向到此页面。
 * 用户可以返回首页重新处理照片。
 */
export default function SuccessPage() {
  useEffect(() => {
    // 清理 URL 参数
    window.history.replaceState({}, '', '/success');
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.12)] p-8 text-center">
        {/* 成功图标 */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-emerald-600"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-[28px] mb-3">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase! Your HD passport photo is ready.
          <br />
          Please check your email for the download link, or return to the homepage to create a new photo.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-xl text-[15px] font-semibold shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all no-underline"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
