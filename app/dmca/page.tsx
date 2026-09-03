import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DMCA / Copyright Policy | Sssion',
  description: 'How to report copyright infringement on Sssion.',
}

export default function DmcaPage() {
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
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Copyright &amp; DMCA Policy
          </h1>
          <p className="text-white/50 mb-8">
            Effective Date: September 3, 2026
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            Sssion respects the work of choreographers, instructors, and artists. If you believe
            content on Sssion infringes your copyright, tell us and we&apos;ll act on it. This page
            explains how, in plain language, consistent with the Digital Millennium Copyright Act
            (DMCA).
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              How to file a complaint
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Email our designated copyright agent at{' '}
                <a href="mailto:dmca@sssion.studio" className="text-[#B76E79] hover:underline">
                  dmca@sssion.studio
                </a>{' '}
                with the subject line &ldquo;DMCA Notice.&rdquo; To be valid, your notice must
                include all of the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="text-white">Identification of your work</span> — describe the
                  copyrighted work you believe has been infringed (e.g. a class video, choreography
                  recording, or photo, with a link to the original if one exists).
                </li>
                <li>
                  <span className="text-white">Where it is on Sssion</span> — the URL(s) or enough
                  detail for us to find the material (creator name, Space, video title).
                </li>
                <li>
                  <span className="text-white">Your contact information</span> — name, email
                  address, and mailing address so we can reach you.
                </li>
                <li>
                  <span className="text-white">A good-faith statement</span> — &ldquo;I have a
                  good-faith belief that the use of the material described above is not authorized
                  by the copyright owner, its agent, or the law.&rdquo;
                </li>
                <li>
                  <span className="text-white">An accuracy statement</span> — &ldquo;The
                  information in this notice is accurate, and under penalty of perjury, I am the
                  copyright owner or authorized to act on the owner&apos;s behalf.&rdquo;
                </li>
                <li>
                  <span className="text-white">Your signature</span> — a physical or electronic
                  signature (typing your full legal name counts).
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              What happens next
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                We review complete notices promptly. If the notice is valid, we remove or disable
                access to the material and notify the creator who posted it. Repeat infringers
                have their Spaces frozen or their accounts terminated.
              </p>
              <p>
                The creator may respond with a counter-notice if they believe the removal was a
                mistake. If we receive a valid counter-notice, we&apos;ll forward it to you; the
                material may be restored in 10&ndash;14 business days unless you tell us
                you&apos;ve filed a court action.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              A note on misuse
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Knowingly filing a false infringement claim can make you liable for damages under
                the DMCA. If you&apos;re not sure whether a use is infringing, consider speaking
                with an attorney before filing.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Questions
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                Anything else copyright-related:{' '}
                <a href="mailto:dmca@sssion.studio" className="text-[#B76E79] hover:underline">
                  dmca@sssion.studio
                </a>
                . For our general rules, see the{' '}
                <a href="/content-policy" className="text-[#B76E79] hover:underline">
                  Content Policy
                </a>{' '}
                and{' '}
                <a href="/terms" className="text-[#B76E79] hover:underline">
                  Terms of Use
                </a>
                .
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}
