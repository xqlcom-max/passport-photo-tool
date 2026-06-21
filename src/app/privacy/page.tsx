import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — Passport Photo Tool',
  description: 'Privacy Policy for Passport Photo Tool',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6 py-16">
          <h1 className="font-extrabold text-3xl mb-8">Privacy Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>

            <h2 className="font-bold text-xl mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to Passport Photo Tool (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="font-semibold text-lg mt-6 mb-3">Photos You Upload</h3>
            <p className="text-gray-600 mb-4">
              When you use our service, you upload photos for processing. These photos are:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Processed temporarily in your browser and/or on our servers</li>
              <li>Deleted immediately after processing and download</li>
              <li>Never stored permanently on our servers</li>
              <li>Never shared with third parties except as described below</li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-3">Third-Party Services</h3>
            <p className="text-gray-600 mb-4">
              If you use our AI background removal feature, your photo may be sent to third-party AI services (such as fal.ai)
              for processing. These services have their own privacy policies and data handling practices.
              We recommend reviewing their privacy policies before using this feature.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Process your photos as requested</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Process payments (through our payment provider Lemon Squeezy)</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure,
              and we cannot guarantee absolute security.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">5. Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use only essential cookies required for the website to function.
              We do not use tracking or analytics cookies.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">6. Children&apos;s Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect
              personal information from children under 13.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">8. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@passportphototool.com" className="text-emerald-600 hover:underline">
                privacy@passportphototool.com
              </a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/" className="text-emerald-600 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
