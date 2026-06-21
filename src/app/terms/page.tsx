import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service — Passport Photo Tool',
  description: 'Terms of Service for Passport Photo Tool',
};

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6 py-16">
          <h1 className="font-extrabold text-3xl mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>

            <h2 className="font-bold text-xl mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using Passport Photo Tool (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Passport Photo Tool provides a photo cropping and formatting helper for passport and visa applications.
              Our service helps you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Crop photos to the correct dimensions</li>
              <li>Resize photos to meet size requirements</li>
              <li>Format photos for printing</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">3. Important Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 font-semibold mb-2">⚠️ Not a Government Service</p>
              <p className="text-amber-700 text-sm">
                Passport Photo Tool is <strong>not</strong> affiliated with any government agency.
                We are a private service that helps with photo formatting. Using our service does not guarantee
                that your photos will be accepted by any government agency.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 font-semibold mb-2">⚠️ No Guarantee of Acceptance</p>
              <p className="text-amber-700 text-sm">
                Photo requirements vary by country, agency, and can change at any time.
                We strongly recommend verifying current requirements with the relevant authority
                before submitting your application.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 font-semibold mb-2">⚠️ U.S. Passport Photo Requirements</p>
              <p className="text-amber-700 text-sm">
                The U.S. Department of State requires passport photos to be original, unedited photographs
                taken within the last 6 months. AI-enhanced or AI-processed photos may not meet their requirements.
                Always use a real photograph taken against a plain white or off-white background.
              </p>
            </div>

            <h2 className="font-bold text-xl mt-8 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Ensuring your photos meet the specific requirements of your application</li>
              <li>Verifying current photo requirements with the relevant authority</li>
              <li>The accuracy and legality of the photos you upload</li>
              <li>Maintaining the confidentiality of your account (if applicable)</li>
            </ul>

            <h2 className="font-bold text-xl mt-8 mb-4">5. Payments</h2>
            <p className="text-gray-600 mb-4">
              Premium features require a one-time payment of $2.99 USD.
              Payments are processed securely through Lemon Squeezy.
              We do not store your payment information.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content, features, and functionality are owned by Passport Photo Tool
              and are protected by international copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, Passport Photo Tool shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
            </p>

            <h2 className="font-bold text-xl mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@passportphototool.com" className="text-emerald-600 hover:underline">
                legal@passportphototool.com
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
