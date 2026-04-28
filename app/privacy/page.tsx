import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Sssion',
  description: 'Privacy Policy for the Sssion mobile app and website.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="py-12 px-6">
        <article className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-white/50 mb-8">
            Effective Date: April 21, 2026
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            Sssion (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and share information when you use
            the Sssion mobile application and website (collectively, the &quot;Service&quot;).
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="text-white/70 space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Account Information</h3>
                <p>When you create an account, we collect your name, email address, username, and profile photo.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Content You Create</h3>
                <p>We collect content you upload or create, including videos, posts, comments, and images.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Usage Data</h3>
                <p>We collect information about how you use the Service, including watch history and app interactions.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Device Information</h3>
                <p>We collect device type and operating system version to ensure app functionality and compatibility.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="text-white/70 space-y-2 list-disc list-inside">
              <li>Provide and maintain the Service</li>
              <li>Enable creator studios and community features</li>
              <li>Process access requests between students and creators</li>
              <li>Send transactional emails (access approvals, notifications)</li>
              <li>Improve the app experience and develop new features</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Information Sharing
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                <strong className="text-white">We do not sell your personal data.</strong>
              </p>
              <p>
                Creator profiles (name, photo, bio, specialties) are publicly visible to help students discover creators.
              </p>
              <p>
                Community posts and comments are visible to approved studio members.
              </p>
              <p>
                We share data with the following service providers only as necessary to operate the Service:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-white">Supabase</strong> — Database and authentication</li>
                <li><strong className="text-white">Mux</strong> — Video hosting and streaming</li>
                <li><strong className="text-white">Resend</strong> — Transactional emails</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              4. Data Storage and Security
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Your data is stored securely via Supabase with encryption at rest and in transit.
              </p>
              <p>
                Videos are hosted on Mux, a trusted video infrastructure provider.
              </p>
              <p>
                We implement industry-standard security measures to protect your information from unauthorized access,
                alteration, or destruction.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Your Rights
            </h2>
            <div className="text-white/70 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Update or correct your account information</li>
                <li>Delete your account and associated data</li>
                <li>Request an export of your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@sssion.studio" className="text-[#B76E79] hover:underline">
                  privacy@sssion.studio
                </a>.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Third-Party Payment Links
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Creators may display their own payment links (such as CashApp, PayPal, Venmo, or other services)
                on their studio profiles.
              </p>
              <p>
                Sssion does not process payments directly and is not responsible for transactions made through
                third-party payment services. Any payments you make to creators are between you and the creator.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Children&apos;s Privacy
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Sssion is not intended for users under the age of 13. We do not knowingly collect personal
                information from children under 13.
              </p>
              <p>
                If we learn that we have collected personal information from a child under 13, we will take
                steps to delete that information promptly.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              8. Changes to This Policy
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will
                notify you through the app or by email.
              </p>
              <p>
                Your continued use of the Service after any changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Contact Us
            </h2>
            <div className="text-white/70">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-4">
                <a href="mailto:privacy@sssion.studio" className="text-[#B76E79] hover:underline">
                  privacy@sssion.studio
                </a>
              </p>
            </div>
          </section>

        </article>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <a href="/" className="text-white/40 text-sm hover:text-white/60 transition-colors">
            &larr; Back to sssion.studio
          </a>
        </div>
      </footer>
    </div>
  )
}
