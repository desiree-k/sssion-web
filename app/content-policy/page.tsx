import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Policy | Sssion',
  description: 'What belongs on Sssion — and what doesn’t.',
}

export default function ContentPolicyPage() {
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
            Content Policy
          </h1>
          <p className="text-white/50 mb-8">
            Effective Date: September 3, 2026
          </p>

          <p className="text-white/70 leading-relaxed mb-8">
            Sssion is a home for <span className="text-white">instructional and artistic movement
            content</span> — pole, heels, floorwork, contemporary, flexibility, and the artists who
            teach and perform it. Movement is expressive, athletic, and sometimes sensual; that
            belongs here. This page draws the lines around it.
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              What&apos;s not allowed
            </h2>
            <div className="text-white/70 space-y-4">
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <span className="text-white">No sexual services or explicit content.</span>{' '}
                  Sssion is for movement instruction and performance, not pornography, nudity
                  presented sexually, or the offer or arrangement of sexual services of any kind.
                </li>
                <li>
                  <span className="text-white">Everyone on camera must be 18 or older.</span>{' '}
                  This applies without exception to every person appearing in videos, photos, or
                  live sessions — not just the account holder. Uploading or streaming content in
                  which any person under 18 is depicted is prohibited and will result in immediate
                  content removal and permanent account termination. Creators and members must
                  also be 18 or older to hold an account on Sssion.
                </li>
                <li>
                  <span className="text-white">No stolen content.</span> Upload only work you
                  created or have the rights to share. Reposting another instructor&apos;s classes,
                  choreography videos, or photos without permission gets content removed and
                  repeat offenders banned — see the{' '}
                  <a href="/dmca" className="text-[#B76E79] hover:underline">DMCA policy</a>.
                </li>
                <li>
                  <span className="text-white">No harassment.</span> No hate, threats, bullying,
                  or targeted abuse of creators, members, or anyone else — in videos, comments,
                  chat rooms, or reviews.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Enforcement
            </h2>
            <div className="text-white/70 space-y-4">
              <p>
                We review reports and act on violations. Depending on severity, that means content
                removal, a frozen Space (everything unavailable until resolved), or permanent
                removal from Sssion. We aim to be fair and to talk to creators first when the
                situation allows it — but safety and legality come before growth, every time.
              </p>
              <p>
                To report something, use the in-app report option or email{' '}
                <a href="mailto:hello@sssion.studio" className="text-[#B76E79] hover:underline">
                  hello@sssion.studio
                </a>
                . Copyright complaints go to{' '}
                <a href="/dmca" className="text-[#B76E79] hover:underline">
                  dmca@sssion.studio
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
