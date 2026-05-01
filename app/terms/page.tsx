import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | Sssion',
  description: 'Terms of Use and End User License Agreement for the Sssion mobile app and website.',
}

export default function TermsOfUsePage() {
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
            Terms of Use
          </h1>
          <p className="text-white/50 mb-8">
            Effective Date: April 30, 2026
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            Welcome to Sssion. These Terms of Use (&quot;Terms&quot;) govern your access to and use of
            the Sssion mobile application and website (collectively, the &quot;Service&quot;). By using
            Sssion, you agree to be bound by these Terms.
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                By creating an account or using Sssion, you agree to these Terms and our{' '}
                <a href="/privacy" className="text-[#B76E79] hover:underline">
                  Privacy Policy
                </a>. If you do not agree to these Terms, do not use the Service.
              </p>
              <p>
                You must be at least 13 years old to use Sssion. By using the Service, you represent
                that you meet this requirement.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. User Conduct
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                <strong className="text-white">Sssion has zero tolerance for objectionable content or abusive behavior.</strong>
              </p>
              <p>
                You agree not to post, upload, or share any content that includes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Hate speech, discrimination, or content promoting violence against individuals or groups</li>
                <li>Harassment, bullying, intimidation, or threats</li>
                <li>Sexually explicit content, especially any content involving minors</li>
                <li>Illegal content or content promoting illegal activities</li>
                <li>Spam, malware, or deceptive content</li>
                <li>Content that infringes on intellectual property rights</li>
              </ul>
              <p>
                <strong className="text-white">Users who violate these terms will have their content removed and their account
                suspended or permanently terminated.</strong> Sssion reserves the right to remove any content at
                its sole discretion.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Content Guidelines
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Sssion is a platform for movement and dance instruction. All content must be related
                to movement education and community building.
              </p>
              <p>
                <strong className="text-white">You are responsible for all content you post.</strong> By posting content,
                you represent that you have the right to share it and that it complies with these Terms.
              </p>
              <p>
                Objectionable, offensive, or abusive content is not permitted. This includes content that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Is unrelated to movement education or community</li>
                <li>Contains profanity, slurs, or offensive language</li>
                <li>Depicts dangerous or harmful activities</li>
                <li>Misrepresents your identity or qualifications</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              4. Reporting and Enforcement
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Users can report objectionable content and abusive users through the app&apos;s reporting
                features or by contacting us directly.
              </p>
              <p>
                <strong className="text-white">Sssion will review all reports within 24 hours.</strong>
              </p>
              <p>
                Content found to violate these Terms will be removed promptly. Users who post
                violating content will be ejected from the platform, which may include:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Removal of specific content</li>
                <li>Temporary account suspension</li>
                <li>Permanent account termination</li>
                <li>Reporting to law enforcement when required by law</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              5. Account Termination
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                <strong className="text-white">Sssion reserves the right to suspend or terminate accounts</strong> that
                violate these Terms, at our sole discretion, with or without notice.
              </p>
              <p>
                You may delete your own account at any time through the app settings. Account deletion
                will remove your profile, content, and associated data as described in our{' '}
                <a href="/privacy" className="text-[#B76E79] hover:underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              6. Intellectual Property
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                You retain ownership of content you create and post on Sssion. By posting content,
                you grant Sssion a non-exclusive, worldwide license to display and distribute your
                content within the Service.
              </p>
              <p>
                The Sssion name, logo, and Service design are trademarks of Sssion and may not be
                used without permission.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              7. Privacy
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Your privacy is important to us. Please review our{' '}
                <a href="/privacy" className="text-[#B76E79] hover:underline">
                  Privacy Policy
                </a>{' '}
                to understand how we collect, use, and protect your information.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              8. Disclaimers
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                The Service is provided &quot;as is&quot; without warranties of any kind. Sssion does not
                guarantee the accuracy, completeness, or usefulness of any content posted by users.
              </p>
              <p>
                Sssion is not responsible for any injuries that may result from following movement
                instruction. Users should exercise appropriate caution and consult professionals
                when necessary.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              9. Changes to Terms
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                We may update these Terms from time to time. If we make material changes, we will
                notify you through the app or by email.
              </p>
              <p>
                Your continued use of the Service after changes are posted constitutes your
                acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              10. Contact Us
            </h2>
            <div className="text-white/70">
              <p>
                If you have questions about these Terms, need to report content, or wish to
                contact us for any reason, please reach out at:
              </p>
              <p className="mt-4">
                <a href="mailto:support@sssion.studio" className="text-[#B76E79] hover:underline">
                  support@sssion.studio
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
