'use client'

import { useRef, useState } from 'react'

/**
 * "Between classes, it used to take five apps. Now it takes a Space." — the
 * studio-facing sibling of the homepage FiveAppsSection, for /studios.
 *
 * Same swap-list (desktop, ≥900px) / accordion (mobile, <900px) mechanic, in a
 * calmer, tighter register: "YOUR WEEK" column heads instead of apps, a 29px
 * answer (vs the homepage's 40px), and a fixed closing line — "Your studio,
 * between classes." — that sits OUTSIDE the interactive area, paired in a row
 * with the CTA so it never swaps.
 *
 * Palette + type follow the shared ivory system. The source design specced
 * Bodoni Moda for the display serif; mapped to the site's --font-fraunces.
 * Per the implementation-spec panel, the closing line is full-ink display type
 * (36px desktop / 28px mobile), second in the hierarchy under the headline.
 */

const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

type Item = { old: string; answer: string }

const ITEMS: Item[] = [
  {
    old: 'A group chat that goes quiet by Thursday',
    answer: "Rooms for every class and instructor. A community that's alive between Tuesdays.",
  },
  {
    old: 'A Dropbox of choreography videos and a link nobody can find',
    answer: 'A sessions library your students reach from their phone.',
  },
  {
    old: 'Zoom for the snow day',
    answer: 'Live classes inside your Space. Schedule it; the room is made.',
  },
  {
    old: 'Instagram announcements, hoping they see it',
    answer: 'A feed your students actually see. No algorithm deciding.',
  },
  {
    old: 'Instructors posting from their personal accounts',
    answer: "Your staff, their own rooms, under your studio's name.",
  },
]

const ROMAN = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']

const css = `
.st-sec{position:relative;background:#F7F4EF;color:#1D1B18;padding:clamp(44px,6vw,52px) clamp(26px,5vw,96px)}
.st-wrap{max-width:1180px;margin:0 auto}
.st-eyebrow{font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#8D877D}
.st-h{font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;letter-spacing:-.02em;text-wrap:pretty}
.st-colhead{display:block;font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase}
.st-colhead-dim{color:#B3ADA2;padding:8px 0 6px}
.st-colhead-rose{color:#9E5C68;padding:6px 0 4px}

/* ── Desktop: swap list ─────────────────────────────────────────────── */
.st-desktop{display:block}
.st-mobile{display:none}

.st-masthead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,360px);column-gap:clamp(36px,5vw,64px);align-items:end}
.st-masthead .st-h{margin:14px 0 0;font-size:clamp(36px,4.4vw,42px);line-height:1.06;max-width:540px}
.st-sub{margin:0;font-size:15px;line-height:1.5;color:#5F5A52;text-wrap:pretty}

.st-swap{--st-gap:clamp(36px,5vw,56px);display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);column-gap:var(--st-gap);margin-top:34px;border-top:1px solid #CFC8BB;padding-top:10px}

.st-list{display:flex;flex-direction:column}
.st-row{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;appearance:none;-webkit-appearance:none;background:transparent;border:0;border-bottom:1px solid #E5E0D6;border-left:3px solid transparent;padding:11px 14px;margin:0;cursor:pointer;font-family:inherit;font-size:14px;line-height:1.4;color:#A9A296;transition:color 160ms cubic-bezier(.4,0,.2,1),background 160ms cubic-bezier(.4,0,.2,1),border-color 160ms cubic-bezier(.4,0,.2,1)}
.st-row:hover{color:#5F5A52}
.st-row-num{flex:none;width:22px;font-size:10px;font-weight:700;letter-spacing:.18em;padding-top:1px}
.st-row-txt{flex:1;min-width:0;text-decoration:line-through;text-decoration-color:#CFC8BB;text-decoration-thickness:1px}
.st-row.is-sel{color:#1D1B18;font-weight:500;background:#FFFFFF;border-left-color:rgba(158,92,104,.40)}
.st-row.is-sel .st-row-txt{text-decoration:none}
.st-row:focus-visible{outline:2px solid #1D1B18;outline-offset:-2px}

.st-answercol{display:flex;flex-direction:column;border-left:1px solid #E5E0D6;padding-left:var(--st-gap);margin-left:calc(-1 * var(--st-gap))}
.st-answerbox{min-height:172px;display:flex;flex-direction:column;justify-content:center;padding:8px 0}
.st-answer{margin:0;font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;font-size:clamp(25px,2.6vw,29px);line-height:1.2;letter-spacing:-.015em;max-width:480px;text-wrap:pretty;color:#1D1B18;animation:st-fade 160ms cubic-bezier(.4,0,.2,1)}
.st-counter{display:flex;align-items:center;gap:14px;margin-top:22px}
.st-counter-rule{height:1px;width:44px;background:#9E5C68;flex:none}
.st-counter-txt{font-size:10px;font-weight:700;letter-spacing:.24em;color:#9E5C68}

/* ── Closing line + CTA (one row on desktop) ────────────────────────── */
.st-close-row{display:flex;align-items:flex-end;justify-content:space-between;gap:56px;margin-top:30px;border-top:1px solid #CFC8BB;padding-top:26px}
.st-closing{margin:0;font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;font-size:clamp(30px,3.4vw,36px);line-height:1.14;letter-spacing:-.02em;color:#1D1B18;max-width:520px;text-wrap:pretty}
.st-cta-block{display:flex;flex-direction:column;align-items:flex-end;gap:9px;flex:none}
.st-cta{display:inline-block;background:#9E5C68;color:#F7F4EF;border-radius:14px;padding:16px 30px;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;transition:opacity 160ms cubic-bezier(.4,0,.2,1)}
.st-cta:hover{opacity:.88;color:#F7F4EF}
.st-cta:active{opacity:.82}
.st-cta:focus-visible{outline:2px solid #1D1B18;outline-offset:3px}
.st-note{font-size:12.5px;line-height:1.5;color:#8D877D;text-align:right}

@keyframes st-fade{from{opacity:0}to{opacity:1}}

/* ── Mobile: accordion ──────────────────────────────────────────────── */
@media(max-width:899px){
  .st-desktop{display:none}
  .st-mobile{display:block}
}
.st-mobile .st-h{font-size:30px;line-height:1.08;margin:12px 0 0}
.st-m-sub{margin:12px 0 0;font-size:14px;line-height:1.5;color:#5F5A52;text-wrap:pretty}
.st-cards{display:flex;flex-direction:column;gap:8px;margin-top:24px}
.st-card{background:#FFFFFF;border:1px solid #E5E0D6;border-radius:16px;transition:border-color 160ms cubic-bezier(.4,0,.2,1)}
.st-card.is-open{border-color:rgba(158,92,104,.40)}
.st-card-btn{display:flex;align-items:flex-start;gap:12px;width:100%;text-align:left;appearance:none;-webkit-appearance:none;background:transparent;border:0;padding:15px;margin:0;cursor:pointer;font-family:inherit}
.st-card.is-open .st-card-btn{padding-bottom:0}
.st-card-btn:focus-visible{outline:2px solid #1D1B18;outline-offset:-2px;border-radius:16px}
.st-card-old{flex:1;min-width:0;font-size:12px;line-height:1.45;color:#A9A296;text-decoration:line-through;text-decoration-color:#CFC8BB;text-decoration-thickness:1px}
.st-card-sign{flex:none;width:11px;padding-top:2px;color:#9E5C68;font-size:11px;font-weight:700}
.st-card-body{display:none;font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;font-size:19px;line-height:1.22;letter-spacing:-.01em;color:#1D1B18;text-wrap:pretty}
.st-card.is-open .st-card-body{display:block;padding:10px 15px 15px}
.st-mobile .st-closing{margin-top:26px;border-top:1px solid #CFC8BB;padding-top:22px;font-size:28px;line-height:1.16;max-width:none}
.st-cta-row{display:flex;flex-direction:column;gap:10px;margin-top:22px}
.st-cta-row .st-cta{padding:15px;text-align:center}
.st-cta-row .st-note{text-align:center;font-size:12.5px;line-height:1.55}

@media(prefers-reduced-motion:reduce){
  .st-answer{animation:none}
  .st-row,.st-card,.st-cta{transition:none}
}
`

export default function StudiosSpaceSection({ ctaHref = STUDIO_MAILTO }: { ctaHref?: string }) {
  const [sel, setSel] = useState(0)
  const [open, setOpen] = useState(0)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSel(i)
      return
    }
    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % ITEMS.length
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + ITEMS.length) % ITEMS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = ITEMS.length - 1
    if (next >= 0) {
      e.preventDefault()
      setSel(next)
      rowRefs.current[next]?.focus()
    }
  }

  return (
    <section className="st-sec" aria-labelledby="st-heading">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ══════════ DESKTOP — swap list ══════════ */}
      <div className="st-wrap st-desktop">
        <div data-reveal className="st-masthead">
          <div>
            <span className="st-eyebrow">For studios</span>
            <h2 id="st-heading" className="st-h">
              Between classes, it used to take five apps.
              <br />
              <br />
              Now it takes a Space.
            </h2>
          </div>
          <p className="st-sub">
            Everything that keeps students connected when they&apos;re not on your floor — in one
            place you own.
          </p>
        </div>

        <div data-reveal data-reveal-delay="120" className="st-swap">
          <div className="st-list" role="tablist" aria-label="Your week, until now">
            <span className="st-colhead st-colhead-dim">Your week, until now</span>
            {ITEMS.map((it, i) => (
              <button
                key={i}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`st-tab-${i}`}
                aria-selected={sel === i}
                aria-controls="st-answer"
                className={`st-row${sel === i ? ' is-sel' : ''}`}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="st-row-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="st-row-txt">{it.old}</span>
              </button>
            ))}
          </div>

          <div className="st-answercol">
            <span className="st-colhead st-colhead-rose">Your week in a Space</span>
            <div className="st-answerbox" id="st-answer" role="tabpanel" aria-labelledby={`st-tab-${sel}`}>
              <p className="st-answer" key={sel} aria-live="polite">
                {ITEMS[sel].answer}
              </p>
              <div className="st-counter">
                <span className="st-counter-rule" aria-hidden />
                <span className="st-counter-txt">{ROMAN[sel]} of five</span>
              </div>
            </div>
          </div>
        </div>

        <div className="st-close-row">
          <p className="st-closing">Your studio, between classes.</p>
          <div className="st-cta-block">
            <a href={ctaHref} className="st-cta">
              Talk to us
            </a>
            <span className="st-note">We&apos;ll walk your team through it — instructors included.</span>
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE — accordion ══════════ */}
      <div className="st-wrap st-mobile">
        <span className="st-eyebrow">For studios</span>
        <h2 className="st-h">
          Between classes, it used to take five apps.
          <br />
          Now it takes a Space.
        </h2>
        <p className="st-m-sub">
          Everything that keeps students connected when they&apos;re not on your floor — in one place
          you own.
        </p>

        <div className="st-cards">
          {ITEMS.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={`st-card${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="st-card-btn"
                  aria-expanded={isOpen}
                  aria-controls={`st-body-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="st-card-old">{it.old}</span>
                  <span className="st-card-sign" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div className="st-card-body" id={`st-body-${i}`} role="region">
                  {it.answer}
                </div>
              </div>
            )
          })}
        </div>

        <p className="st-closing">Your studio, between classes.</p>

        <div className="st-cta-row">
          <a href={ctaHref} className="st-cta">
            Talk to us
          </a>
          <span className="st-note">We&apos;ll walk your team through it — instructors included.</span>
        </div>
      </div>
    </section>
  )
}
