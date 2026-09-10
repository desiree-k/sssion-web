'use client'

import { useState } from 'react'

export const REPORT_CATEGORIES: { value: string; label: string; hint: string }[] = [
  { value: 'sexual_content', label: 'Non-consensual / prohibited sexual content', hint: 'Explicit content that violates our rules, or content shared without consent' },
  { value: 'minor_safety', label: 'Minor safety', hint: 'Anything involving a minor — reported and escalated with priority' },
  { value: 'violence', label: 'Violence or threats', hint: 'Threats, incitement, or graphic violence' },
  { value: 'hate', label: 'Hate or harassment', hint: 'Targeted harassment or hateful conduct' },
  { value: 'spam_misleading', label: 'Spam or misleading', hint: 'Scams, impersonation, or deceptive content' },
  { value: 'copyright', label: 'Copyright / IP', hint: 'For formal takedowns, see the DMCA page' },
  { value: 'other', label: 'Something else', hint: 'Describe it below' },
]

const inputCls =
  'w-full rounded-lg bg-[#12121A] border border-[#2A2A30] px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#B76E79] transition-colors'

export default function ReportForm({
  initialUrl = '',
  initialUsername = '',
  initialSubject = '',
}: {
  initialUrl?: string
  initialUsername?: string
  initialSubject?: string
}) {
  const [subjectUrl, setSubjectUrl] = useState(initialUrl)
  const [subjectUsername, setSubjectUsername] = useState(initialUsername)
  const [category, setCategory] = useState('')
  const [details, setDetails] = useState(
    initialSubject ? `Reporting: ${initialSubject}\n\n` : ''
  )
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const canSubmit =
    category !== '' &&
    (subjectUrl.trim() !== '' || subjectUsername.trim() !== '' || details.trim() !== '') &&
    status !== 'sending'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) {
      setErrorMsg('Please choose a category.')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_url: subjectUrl.trim(),
          subject_username: subjectUsername.trim().replace(/^@/, ''),
          category,
          details: details.trim(),
          reporter_email: email.trim(),
          company, // honeypot — must stay empty
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-[#2A2A30] bg-[#12121A] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B76E79]/15">
          <svg className="h-6 w-6 text-[#B76E79]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-white">Report received</h2>
        <p className="text-white/60 leading-relaxed">
          Thank you. Our moderation team reviews every report. If you left an email we may follow up;
          otherwise no reply is needed. Urgent minor-safety concerns are escalated immediately.
        </p>
        <a href="/" className="mt-6 inline-block text-sm text-[#B76E79] hover:underline">
          ← Back to sssion.studio
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* honeypot: hidden from users, bots fill it */}
      <div aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">
          What are you reporting?
        </label>
        <p className="mb-3 text-xs text-white/40">
          A profile link or username, and/or the page URL. At least one, or describe it in the details.
        </p>
        <input
          type="text"
          value={subjectUsername}
          onChange={(e) => setSubjectUsername(e.target.value)}
          placeholder="Username (e.g. @creator)"
          className={inputCls}
        />
        <input
          type="url"
          value={subjectUrl}
          onChange={(e) => setSubjectUrl(e.target.value)}
          placeholder="Page URL (https://sssion.studio/…)"
          className={`${inputCls} mt-3`}
        />
      </div>

      <fieldset>
        <legend className="mb-3 block text-sm font-medium text-white/80">Category</legend>
        <div className="space-y-2">
          {REPORT_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                category === c.value
                  ? 'border-[#B76E79] bg-[#B76E79]/10'
                  : 'border-[#2A2A30] hover:border-[#3A3A42]'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={category === c.value}
                onChange={() => setCategory(c.value)}
                className="mt-1 accent-[#B76E79]"
              />
              <span>
                <span className="block text-sm text-white">{c.label}</span>
                <span className="block text-xs text-white/40">{c.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          placeholder="Tell us what's happening. Include links, timestamps, or usernames if you can."
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">
          Your email <span className="font-normal text-white/40">(optional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com — only if you'd like a follow-up"
          className={inputCls}
        />
      </div>

      {status === 'error' && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg bg-[#B76E79] px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === 'sending' ? 'Sending…' : 'Submit report'}
      </button>

      <p className="text-center text-xs text-white/30">
        No account needed. Reports are confidential. For formal copyright takedowns, use the{' '}
        <a href="/dmca" className="text-white/50 hover:underline">DMCA page</a>.
      </p>
    </form>
  )
}
