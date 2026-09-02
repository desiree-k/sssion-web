'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Creator waitlist section for the homepage.
 * Founding Studios are full, so the creator CTAs now scroll here instead of /join.
 * Inserts into the `creator_waitlist` table via the anon client; a unique-violation
 * on email (23505) is treated as "already on the list" rather than an error.
 * Rendered inside the homepage's `.ss-home` container so it inherits the ss-* design.
 */

const css = `
html{scroll-behavior:smooth}
.ss-wl{position:relative;background:#2A2A3E;scroll-margin-top:72px}
.ss-wl-inner{max-width:620px;margin:0 auto;text-align:center}
.ss-wl-lead{font-size:clamp(16px,2vw,19px);line-height:1.6;color:#C4C4D0;margin:0 auto clamp(34px,5vw,44px);max-width:500px}
.ss-wl-form{display:flex;flex-direction:column;gap:14px;text-align:left}
.ss-wl-label{display:block;font-size:13px;font-weight:600;color:#B9B9C6;margin-bottom:8px}
.ss-wl-label .opt{color:#6d6d80;font-weight:500}
.ss-wl-input{width:100%;padding:15px 16px;background:#16162a;border:1px solid rgba(255,255,255,.14);border-radius:13px;color:#fff;font-size:16px;font-family:inherit;transition:border-color .2s ease}
.ss-wl-input::placeholder{color:rgba(255,255,255,.32)}
.ss-wl-input:focus{outline:none;border-color:#B76E79}
.ss-wl-submit{margin-top:6px;width:100%;border:none;cursor:pointer;justify-content:center}
.ss-wl-submit:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:0 12px 30px -8px rgba(183,110,121,.6)}
.ss-wl-error{color:#E9899A;font-size:14px;margin:2px 0 0}
.ss-wl-invite{margin:22px 0 0;font-size:14px;color:#8a8a9c}
.ss-wl-invite a{color:#D89AA3;font-weight:600}
.ss-wl-invite a:hover{color:#E8B4BC;text-decoration:underline}
.ss-wl-success{padding:clamp(32px,5vw,44px) clamp(20px,4vw,32px);background:rgba(183,110,121,.08);border:1px solid rgba(183,110,121,.3);border-radius:20px}
.ss-wl-success-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(24px,4vw,34px);line-height:1.1;letter-spacing:-.02em;margin:0}
.ss-wl-success-p{font-size:16px;color:#C4C4D0;margin:14px 0 0}
`

type Status = 'idle' | 'submitting' | 'success' | 'duplicate'

export default function CreatorWaitlist() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [instagram, setInstagram] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const done = status === 'success' || status === 'duplicate'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    setStatus('submitting')
    setError(null)

    try {
      const { error: insertError } = await supabase.from('creator_waitlist').insert({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
        discipline: discipline.trim() || null,
        instagram_handle: instagram.trim().replace(/^@/, '') || null,
      })

      if (insertError) {
        // Duplicate email — already on the list, treat gracefully
        if (insertError.code === '23505') {
          setStatus('duplicate')
          return
        }
        throw insertError
      }

      setStatus('success')
    } catch (err) {
      console.error('Creator waitlist error:', err)
      setError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <section id="waitlist" className="ss-section ss-wl">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ss-wrap ss-wl-inner">
        <div data-reveal className="ss-eyebrow2">Join the waitlist</div>
        <h2 data-reveal data-reveal-delay="80" className="ss-h2">
          The next class of creators
        </h2>
        <p data-reveal data-reveal-delay="160" className="ss-wl-lead">
          Founding creator program is full. Join the waitlist and we&apos;ll open your door soon.
        </p>

        {done ? (
          <div data-reveal className="ss-wl-success" role="status">
            <p className="ss-wl-success-h">
              {status === 'duplicate'
                ? 'You’re already on the list 🤍'
                : 'You’re on the list 🤍'}
            </p>
            {status === 'success' && (
              <p className="ss-wl-success-p">We&apos;ll be in touch soon.</p>
            )}
          </div>
        ) : (
          <form data-reveal data-reveal-delay="220" className="ss-wl-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="ss-wl-label" htmlFor="wl-email">Email</label>
              <input
                id="wl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="ss-wl-input"
              />
            </div>
            <div>
              <label className="ss-wl-label" htmlFor="wl-name">Name</label>
              <input
                id="wl-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="ss-wl-input"
              />
            </div>
            <div>
              <label className="ss-wl-label" htmlFor="wl-discipline">What do you teach?</label>
              <input
                id="wl-discipline"
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="Pole, heels, contemporary, flow…"
                className="ss-wl-input"
              />
            </div>
            <div>
              <label className="ss-wl-label" htmlFor="wl-instagram">
                Instagram handle <span className="opt">(optional)</span>
              </label>
              <input
                id="wl-instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
                className="ss-wl-input"
              />
            </div>

            {error && <p className="ss-wl-error">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="ss-btn-primary ss-wl-submit"
            >
              {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}

        {!done && (
          <p data-reveal className="ss-wl-invite">
            Have an invite? <a href="/join">Continue here</a>
          </p>
        )}
      </div>
    </section>
  )
}
