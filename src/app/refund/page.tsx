import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Refund Policy — Passport Photo Tool',
  description: 'Refund Policy for Passport Photo Tool',
};

export default function RefundPolicy() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6 py-16">
          <h1 className="font-extrabold text-3xl mb-8">Refund Policy</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>

            <h2 className="font-bold text-xl mt-8 mb-4">1. Overview</h2>
            <p className="text-gray-600 mb-4">
              We want you to be satisfied with our service. If you are not happy with your purchase,
              we are here to help.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">2. Refund Eligibility</h2>
            <p className="text-gray-600 mb-4">
              You are eligible for a full refund within 30 days of your purchase if:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The service did not work as described</li>
              <li>You experienced technical issues that prevented you from using the service</li>
              <li>You are unsatisfied with the quality of the output</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">3. How to Request a Refund</h2>
            <p className="text-gray-600 mb-4">
              To request a refund, please email us at{' '}
              <a href="mailto:support@passportphototool.com" className="text-emerald-600 hover:underline">
                support@passportphototool.com
              </a>{' '}
              with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Your order number (from Lemon Squeezy)</li>
              <li>The email address used for the purchase</li>
              <li>A brief description of the issue</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">4. Refund Processing</h2>
            <p className="text-gray-600 mb-4">
              Once your refund request is received and approved:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Refunds are processed within 5-10 business days</li>
              <li>The refund will be credited to your original payment method</li>
              <li>You will receive an email confirmation when the refund is processed</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">5. Exceptions</h2>
            <p className="text-gray-600 mb-4">
              Refunds may not be available if:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The refund request is made more than 30 days after purchase</li>
              <li>The service was used successfully and the photo was downloaded</li>
              <li>The refund request is made for reasons outside our control (e.g., photo rejected by government agency)</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">6. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our Refund Policy, please contact us at{' '}
              <a href="mailto:support@passportphototool.com" className="text-emerald-600 hover:underline">
                support@passportphototool.com
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
