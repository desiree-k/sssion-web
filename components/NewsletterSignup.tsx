'use client'

import { useEffect, useState } from 'react'

const GROUPS: { value: 'creator' | 'studio' | 'member'; label: string }[] = [
  { value: 'creator', label: 'I teach or create' },
  { value: 'studio', label: 'I run a studio' },
  { value: 'member', label: 'I take classes' },
]

// Scoped styles for the newsletter block, layered on the ivory marketing system.
const CSS = `
.nl{max-width:520px}
.nl-heading{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(24px,3.2vw,32px);line-height:1.05;letter-spacing:-.02em;color:#1D1B18;margin:0 0 10px}
.nl-copy{font-size:15px;line-height:1.6;color:#5F5A52;margin:0 0 22px}
.nl-form{display:flex;flex-direction:column;gap:12px}
.nl-row{display:flex;flex-wrap:wrap;gap:12px}
.nl-row>*{flex:1 1 180px}
.nl-input,.nl-select{width:100%;padding:13px 15px;border-radius:11px;border:1px solid #E5E0D6;background:#FFFFFF;color:#1D1B18;font-family:inherit;font-size:15px;transition:border-color .2s ease}
.nl-input::placeholder{color:#B0AAA0}
.nl-input:focus,.nl-select:focus{outline:none;border-color:#9E5C68}
.nl-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238D877D' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center;padding-right:38px}
.nl-select.nl-unset{color:#B0AAA0}
.nl-btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 26px;border-radius:11px;background:#1D1B18;color:#F7F4EF;border:1px solid #1D1B18;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:background .2s ease,opacity .2s ease}
.nl-btn:hover:not(:disabled){background:#3A3630}
.nl-btn:disabled{opacity:.5;cursor:not-allowed}
.nl-consent{font-size:12px;line-height:1.5;color:#8D877D;margin:2px 0 0}
.nl-msg{font-size:14px;line-height:1.5;margin:2px 0 0}
.nl-msg-err{color:#9E5C68}
.nl-success{padding:18px 20px;border:1px solid #E5E0D6;border-radius:13px;background:#FFFFFF}
.nl-success-h{font-family:var(--font-fraunces),Georgia,serif;font-size:19px;color:#1D1B18;margin:0 0 4px}
.nl-success-p{font-size:14px;line-height:1.55;color:#5F5A52;margin:0}
`

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [userGroup, setUserGroup] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [source, setSource] = useState('site')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Read optional ?src= from the page URL (client-side, no Suspense needed).
  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get('src')
    if (src && src.trim() !== '') setSource(src.trim().slice(0, 120))
  }, [])

  const canSubmit = email.trim() !== '' && userGroup !== '' && status !== 'sending'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
          user_group: userGroup,
          source,
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

  return (
    <div className="nl">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <h2 className="nl-heading">Letters from Sssion</h2>

      {status === 'done' ? (
        <div className="nl-success" role="status">
          <p className="nl-success-h">You&apos;re in. Check your inbox.</p>
          <p className="nl-success-p">
            We&apos;ll be in touch — occasionally, and only when it&apos;s worth it.
          </p>
        </div>
      ) : (
        <>
          <p className="nl-copy">
            Occasional notes on building a room of your own — what we&apos;re making, what creators
            are teaching us, what&apos;s coming. No noise.
          </p>
          <form className="nl-form" onSubmit={submit} noValidate>
            {/* honeypot: hidden from users, bots fill it */}
            <div
              aria-hidden
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
            >
              <label>
                Company
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
            </div>

            <div className="nl-row">
              <input
                type="email"
                required
                className="nl-input"
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                className="nl-input"
                placeholder="First name (optional)"
                aria-label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <select
              required
              aria-label="I'm here as…"
              className={`nl-select${userGroup === '' ? ' nl-unset' : ''}`}
              value={userGroup}
              onChange={(e) => setUserGroup(e.target.value)}
            >
              <option value="" disabled>
                I&apos;m here as…
              </option>
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

            <button type="submit" className="nl-btn" disabled={!canSubmit}>
              {status === 'sending' ? 'One moment…' : 'Keep in touch'}
            </button>

            {status === 'error' && (
              <p className="nl-msg nl-msg-err" role="alert">
                {errorMsg}
              </p>
            )}

            <p className="nl-consent">
              Occasional emails from Sssion. Unsubscribe any time.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
