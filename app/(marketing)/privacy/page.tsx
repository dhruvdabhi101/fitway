export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: April 14, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
              <p className="text-slate-600 mt-2">
                At Fitway, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our gym management platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
              <p className="text-slate-600 mt-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-slate-600 mt-2 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Business information (gym name, phone number)</li>
                <li>Member information (names, contact details, membership plans)</li>
                <li>Payment information (processed securely through our payment partners)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Information</h2>
              <p className="text-slate-600 mt-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-slate-600 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Data Sharing</h2>
              <p className="text-slate-600 mt-2">
                <strong>We do not sell your data to anyone.</strong> We share your personal information only in the 
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mt-2 space-y-1">
                <li>With your explicit consent</li>
                <li>With service providers who assist in operating our platform (hosting, analytics)</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Data Security</h2>
              <p className="text-slate-600 mt-2">
                We implement appropriate technical and organizational measures to protect your personal data 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption 
                of data in transit and at rest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Data Retention</h2>
              <p className="text-slate-600 mt-2">
                We retain your personal information for as long as your account is active or as needed to 
                provide you services. Upon deletion of your account, we will delete your data within 90 days 
                except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Your Rights</h2>
              <p className="text-slate-600 mt-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-slate-600 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Cookies</h2>
              <p className="text-slate-600 mt-2">
                We use cookies and similar tracking technologies to maintain session state and remember 
                your preferences. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">9. Children's Privacy</h2>
              <p className="text-slate-600 mt-2">
                Our service is not directed to individuals under 18. We do not knowingly collect personal 
                information from children. If we learn that we have collected data from a minor, we will 
                take steps to delete that information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">10. Changes to This Policy</h2>
              <p className="text-slate-600 mt-2">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">11. Contact Us</h2>
              <p className="text-slate-600 mt-2">
                If you have any questions about this Privacy Policy, please contact us at privacy@fitway.app.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
