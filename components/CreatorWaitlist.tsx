'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Creator waitlist section for the homepage.
 * Founding creator program is full, so the creator CTAs scroll here instead of /join.
 * Inserts into the `creator_waitlist` table via the anon client; a unique-violation
 * on email (23505) is treated as "already on the list" rather than an error.
 * Rendered inside the homepage's `.mk` container so it inherits the ivory system.
 * (Functionality unchanged — restyled from the old dark theme to ivory editorial.)
 */

const css = `
html{scroll-behavior:smooth}
.mk-wl{position:relative;background:#FFFFFF;border-top:1px solid #E5E0D6;border-bottom:1px solid #E5E0D6;scroll-margin-top:72px}
.mk-wl-inner{max-width:600px;margin:0 auto;text-align:center}
.mk-wl-lead{font-size:clamp(16px,2vw,19px);line-height:1.6;color:#8D877D;margin:0 auto clamp(32px,5vw,44px);max-width:500px}
.mk-wl-form{display:flex;flex-direction:column;gap:14px;text-align:left}
.mk-wl-label{display:block;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#8D877D;margin-bottom:8px}
.mk-wl-label .opt{color:#B9B3A8;font-weight:500;letter-spacing:0;text-transform:none}
.mk-wl-input{width:100%;padding:15px 16px;background:#F7F4EF;border:1px solid #E5E0D6;border-radius:12px;color:#1D1B18;font-size:16px;font-family:inherit;transition:border-color .2s ease,background .2s ease}
.mk-wl-input::placeholder{color:#B9B3A8}
.mk-wl-input:focus{outline:none;border-color:#1D1B18;background:#FFFFFF}
.mk-wl-submit{margin-top:6px;width:100%}
.mk-wl-submit:disabled{opacity:.55;cursor:not-allowed}
.mk-wl-error{color:#9E5C68;font-size:14px;margin:2px 0 0}
.mk-wl-invite{margin:22px 0 0;font-size:14px;color:#8D877D}
.mk-wl-invite a{color:#9E5C68;font-weight:600;border-bottom:1px solid #9E5C68;text-decoration:none}
.mk-wl-invite a:hover{color:#1D1B18;border-color:#1D1B18}
.mk-wl-success{padding:clamp(30px,5vw,44px) clamp(20px,4vw,32px);background:#F7F4EF;border:1px solid #E5E0D6;border-radius:20px}
.mk-wl-success-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(24px,4vw,34px);line-height:1.1;letter-spacing:-.02em;margin:0}
.mk-wl-success-p{font-size:16px;color:#8D877D;margin:14px 0 0}
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
    <section id="waitlist" className="mk-section mk-wl">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mk-wrap mk-wl-inner">
        <div data-reveal className="mk-eyebrow">Join the waitlist</div>
        <h2 data-reveal data-reveal-delay="80" className="mk-h2">
          The next class of creators
        </h2>
        <p data-reveal data-reveal-delay="160" className="mk-wl-lead">
          Founding creator program is full. Join the waitlist and we&apos;ll open your door soon.
        </p>

        {done ? (
          <div data-reveal className="mk-wl-success" role="status">
            <p className="mk-wl-success-h">
              {status === 'duplicate'
                ? 'You’re already on the list 🤍'
                : 'You’re on the list 🤍'}
            </p>
            {status === 'success' && (
              <p className="mk-wl-success-p">We&apos;ll be in touch soon.</p>
            )}
          </div>
        ) : (
          <form data-reveal data-reveal-delay="220" className="mk-wl-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mk-wl-label" htmlFor="wl-email">Email</label>
              <input
                id="wl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="mk-wl-input"
              />
            </div>
            <div>
              <label className="mk-wl-label" htmlFor="wl-name">Name</label>
              <input
                id="wl-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mk-wl-input"
              />
            </div>
            <div>
              <label className="mk-wl-label" htmlFor="wl-discipline">What do you teach?</label>
              <input
                id="wl-discipline"
                type="text"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                placeholder="Pole, heels, contemporary, flow…"
                className="mk-wl-input"
              />
            </div>
            <div>
              <label className="mk-wl-label" htmlFor="wl-instagram">
                Instagram handle <span className="opt">(optional)</span>
              </label>
              <input
                id="wl-instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
                className="mk-wl-input"
              />
            </div>

            {error && <p className="mk-wl-error">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mk-btn mk-btn-ink mk-wl-submit"
            >
              {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}

        {!done && (
          <p data-reveal className="mk-wl-invite">
            Have an invite? <a href="/join">Continue here</a>
          </p>
        )}
      </div>
    </section>
  )
}
