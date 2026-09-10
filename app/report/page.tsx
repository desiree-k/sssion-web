import { Metadata } from 'next'
import ReportForm from '@/components/ReportForm'
import ComplianceFooterLinks from '@/components/ComplianceFooterLinks'

export const metadata: Metadata = {
  title: 'Report content | Sssion',
  description:
    'Report content or a profile on Sssion. No account required — our moderation team reviews every report.',
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; username?: string; subject?: string }>
}) {
  const sp = await searchParams
  const initialUrl = typeof sp.url === 'string' ? sp.url : ''
  const initialUsername = typeof sp.username === 'string' ? sp.username : ''
  const initialSubject = typeof sp.subject === 'string' ? sp.subject : ''

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Report content</h1>
          <p className="text-white/60 leading-relaxed mb-8">
            See something that breaks our{' '}
            <a href="/content-policy" className="text-[#B76E79] hover:underline">Content Policy</a>?
            Tell us here — you don&apos;t need an account. Every report goes to our moderation team.
            Reports involving the safety of a minor are escalated immediately.
          </p>
          <ReportForm
            initialUrl={initialUrl}
            initialUsername={initialUsername}
            initialSubject={initialSubject}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 text-white/50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <ComplianceFooterLinks />
          <a href="/" className="text-sm hover:text-white/70 transition-colors">
            ← Back to sssion.studio
          </a>
        </div>
      </footer>
    </div>
  )
}
