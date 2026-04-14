export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-8">Last updated: April 14, 2026</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mt-2">
                By accessing and using Fitway, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">2. Description of Service</h2>
              <p className="text-slate-600 mt-2">
                Fitway is a gym management platform designed to help gym owners manage their members, 
                payments, and fitness programs. We provide tools for tracking memberships, scheduling sessions, 
                and processing payments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">3. User Responsibilities</h2>
              <p className="text-slate-600 mt-2">
                You are responsible for maintaining the confidentiality of your account credentials and 
                for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mt-2 space-y-1">
                <li>Provide accurate and complete information during registration</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Not use the service for any unlawful or prohibited purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">4. Membership and Billing</h2>
              <p className="text-slate-600 mt-2">
                Fitway offers various subscription plans for gym management. By subscribing to our service, 
                you agree to pay all fees associated with your chosen plan. All fees are non-refundable except 
                as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">5. Data Privacy</h2>
              <p className="text-slate-600 mt-2">
                We respect your privacy and are committed to protecting your personal data. We do not sell 
                your data to anyone under any circumstances. Your data is used solely to provide and improve 
                our services to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">6. Limitation of Liability</h2>
              <p className="text-slate-600 mt-2">
                Fitway shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">7. Changes to Terms</h2>
              <p className="text-slate-600 mt-2">
                We reserve the right to modify these terms at any time. We will notify users of any material 
                changes via email or through the service. Continued use of Fitway after such modifications 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">8. Contact Us</h2>
              <p className="text-slate-600 mt-2">
                If you have any questions about these Terms of Service, please contact us at support@fitway.app.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
