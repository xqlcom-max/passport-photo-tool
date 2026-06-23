'use client';

import { useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function PaymentModal({ isOpen, onClose, onCheckout, isLoading }: PaymentModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center p-6 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-[20px] shadow-[0_20px_48px_rgba(0,0,0,0.12)] max-w-[420px] w-full p-8 transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'}`}>
        <button
          className="absolute top-4 right-4 w-8 h-8 border-none bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2 className="font-extrabold text-[22px] mb-1">Get the Full Version</h2>
        <p className="text-sm text-gray-500 mb-6">Unlock HD download with no watermark</p>
        <ul className="list-none mb-6">
          {[
            'High-resolution 600×600px (300 DPI)',
            'No watermark on download',
            'Instant download — no waiting',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2.5 py-2 text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-emerald-600 flex-shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <div className="text-center mb-5">
          <span className="font-extrabold text-[36px] tracking-[-1px]">$2.99</span>
          <span className="text-sm text-gray-400 ml-1">one-time</span>
        </div>
        <button
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white border-none rounded-xl text-[15px] font-semibold w-full shadow-[0_2px_8px_rgba(5,150,105,0.25)] hover:bg-emerald-700 hover:shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing...
            </>
          ) : (
            'Pay Now — $2.99'
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">Secure payment via Gumroad</p>
      </div>
    </div>
  );
}
