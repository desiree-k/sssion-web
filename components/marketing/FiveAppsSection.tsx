'use client'

import { useRef, useState } from 'react'

/**
 * "It used to take five apps. Now it takes a Space." — the app-consolidation
 * section for the ivory marketing homepage.
 *
 * Two interaction models, one responsive component (switches at 900px):
 *  - Desktop (≥900px) — swap list. Six struck "used to" lines are a role="tablist";
 *    the Sssion answer renders once, large, in the right panel and swaps on
 *    selection. Selection follows hover + click + Enter/Space (+ arrow keys);
 *    default index 0, leaving the list never resets it.
 *  - Mobile (<900px) — accordion. Each card's header is the struck line; tapping
 *    opens the Sssion answer beneath. One open at a time; card 01 open on load.
 *
 * Palette + type follow the shared ivory system (MarketingChrome). The source
 * design specced Bodoni Moda for the display serif; mapped here to the site's
 * --font-fraunces so it stays consistent with every other marketing page.
 */

type Item = { old: string; answer: string }

const ITEMS: Item[] = [
  {
    old: 'A Zoom link pasted into DMs',
    answer:
      'Live classes run inside your Space. Schedule it; the room is made. Only you appear in the recording.',
  },
  {
    old: 'A Drive folder of replays and a spreadsheet of who paid',
    answer: 'A sessions library where access follows the person, not the link.',
  },
  {
    old: 'A Facebook group nobody checks',
    answer: 'A community feed your members actually see. No algorithm deciding.',
  },
  {
    old: 'A Linktree and a website you never update',
    answer: 'sssion.studio/yourname. Page, community, classes — one link.',
  },
  {
    old: 'Instagram for reach, and the fear that comes with it',
    answer: 'Discover: found by people looking for movement. Off the algorithm.',
  },
]

const ROMAN = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']

const css = `
.fa-sec{position:relative;background:#F7F4EF;color:#1D1B18;padding:clamp(56px,8vw,80px) clamp(26px,5vw,112px)}
.fa-wrap{max-width:1180px;margin:0 auto}
.fa-eyebrow{font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#8D877D}
.fa-label{display:block;font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;padding:8px 0 6px}
.fa-label-dim{color:#B3ADA2}
.fa-label-rose{color:#9E5C68}
.fa-h{font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;letter-spacing:-.02em;text-wrap:pretty}

/* ── Desktop: swap list ─────────────────────────────────────────────── */
.fa-desktop{display:block}
.fa-mobile{display:none}

.fa-masthead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,420px);column-gap:clamp(40px,6vw,88px);align-items:end}
.fa-masthead .fa-h{margin:18px 0 0;font-size:clamp(46px,5.2vw,60px);line-height:1.02;max-width:720px}
.fa-sub{margin:0;font-size:17px;line-height:1.55;color:#5F5A52;text-wrap:pretty}

.fa-swap{--fa-gap:clamp(40px,5vw,72px);display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);column-gap:var(--fa-gap);margin-top:56px;border-top:1px solid #CFC8BB;padding-top:14px}

.fa-list{display:flex;flex-direction:column}
.fa-row{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;appearance:none;-webkit-appearance:none;background:transparent;border:0;border-bottom:1px solid #E5E0D6;border-left:3px solid transparent;padding:14px 16px;margin:0;cursor:pointer;font-family:inherit;font-size:15px;line-height:1.45;color:#A9A296;transition:color 160ms cubic-bezier(.4,0,.2,1),background 160ms cubic-bezier(.4,0,.2,1),border-color 160ms cubic-bezier(.4,0,.2,1)}
.fa-row:hover{color:#5F5A52}
.fa-row-num{flex:none;width:22px;font-size:10px;font-weight:700;letter-spacing:.18em;padding-top:2px}
.fa-row-txt{flex:1;min-width:0;text-decoration:line-through;text-decoration-color:#CFC8BB;text-decoration-thickness:1px}
.fa-row.is-sel{color:#1D1B18;font-weight:500;background:#FFFFFF;border-left-color:rgba(158,92,104,.40)}
.fa-row.is-sel .fa-row-txt{text-decoration:none}
.fa-row:focus-visible{outline:2px solid #1D1B18;outline-offset:-2px}

.fa-answercol{display:flex;flex-direction:column;border-left:1px solid #E5E0D6;padding-left:var(--fa-gap);margin-left:calc(-1 * var(--fa-gap))}
.fa-answerbox{min-height:300px;display:flex;flex-direction:column;justify-content:center;padding:12px 0}
.fa-answer{margin:0;font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;font-size:clamp(32px,3.4vw,40px);line-height:1.16;letter-spacing:-.015em;max-width:560px;text-wrap:pretty;color:#1D1B18;animation:fa-fade 160ms cubic-bezier(.4,0,.2,1)}
.fa-counter{display:flex;align-items:center;gap:14px;margin-top:34px}
.fa-counter-rule{height:1px;width:44px;background:#9E5C68;flex:none}
.fa-counter-txt{font-size:10px;font-weight:700;letter-spacing:.24em;color:#9E5C68}

/* ── Closing line (between the table and the CTA) ───────────────────── */
.fa-closing{margin:32px 0 0;font-style:italic;font-size:15px;line-height:1.55;color:#8D877D;max-width:620px;text-wrap:pretty}

/* ── CTA (shared shell, per-viewport layout) ────────────────────────── */
.fa-cta-row{display:flex;align-items:center;gap:26px;flex-wrap:wrap;margin-top:52px;border-top:1px solid #CFC8BB;padding-top:34px}
.fa-cta{display:inline-block;background:#9E5C68;color:#F7F4EF;border-radius:14px;padding:18px 32px;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;transition:opacity 160ms cubic-bezier(.4,0,.2,1)}
.fa-cta:hover{opacity:.88;color:#F7F4EF}
.fa-cta:active{opacity:.82}
.fa-cta:focus-visible{outline:2px solid #1D1B18;outline-offset:3px}
.fa-note{font-size:14px;line-height:1.55;color:#8D877D}

@keyframes fa-fade{from{opacity:0}to{opacity:1}}

/* ── Mobile: accordion ──────────────────────────────────────────────── */
@media(max-width:899px){
  .fa-desktop{display:none}
  .fa-mobile{display:block}
}
.fa-mobile .fa-h{font-size:36px;line-height:1.04;margin:16px 0 0}
.fa-m-sub{margin:14px 0 0;font-size:14.5px;line-height:1.55;color:#5F5A52;text-wrap:pretty}
.fa-cards{display:flex;flex-direction:column;gap:10px;margin-top:34px}
.fa-card{background:#FFFFFF;border:1px solid #E5E0D6;border-radius:16px;transition:border-color 160ms cubic-bezier(.4,0,.2,1)}
.fa-card.is-open{border-color:rgba(158,92,104,.40)}
.fa-card-btn{display:flex;align-items:flex-start;gap:12px;width:100%;text-align:left;appearance:none;-webkit-appearance:none;background:transparent;border:0;padding:18px;margin:0;cursor:pointer;font-family:inherit}
.fa-card.is-open .fa-card-btn{padding-bottom:0}
.fa-card-btn:focus-visible{outline:2px solid #1D1B18;outline-offset:-2px;border-radius:16px}
.fa-card-old{flex:1;min-width:0;font-size:12.5px;line-height:1.45;color:#A9A296;text-decoration:line-through;text-decoration-color:#CFC8BB;text-decoration-thickness:1px}
.fa-card-sign{flex:none;width:11px;padding-top:3px;color:#9E5C68;font-size:11px;font-weight:700}
.fa-card-body{display:none;font-family:var(--font-fraunces),Didot,Georgia,serif;font-weight:400;font-size:21px;line-height:1.22;letter-spacing:-.01em;color:#1D1B18;text-wrap:pretty}
.fa-card.is-open .fa-card-body{display:block;padding:12px 18px 18px}
.fa-mobile .fa-closing{margin-top:26px;font-size:13.5px}
.fa-mobile .fa-cta-row{flex-direction:column;align-items:stretch;gap:12px;border-top:0;padding-top:0;margin-top:26px}
.fa-mobile .fa-cta{padding:17px;text-align:center}
.fa-mobile .fa-note{text-align:center;font-size:12.5px}

@media(prefers-reduced-motion:reduce){
  .fa-answer{animation:none}
  .fa-row,.fa-card,.fa-cta{transition:none}
}
`

export default function FiveAppsSection() {
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
    <section className="fa-sec" aria-labelledby="fa-heading">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ══════════ DESKTOP — swap list ══════════ */}
      <div className="fa-wrap fa-desktop">
        <div data-reveal className="fa-masthead">
          <div>
            <span className="fa-eyebrow">One space, not five tabs</span>
            <h2 id="fa-heading" className="fa-h">
              It used to take five apps. Now it takes a Space.
            </h2>
          </div>
          <p className="fa-sub">Everything you were taping together — in one place you own.</p>
        </div>

        <div data-reveal data-reveal-delay="120" className="fa-swap">
          <div className="fa-list" role="tablist" aria-label="What it used to take">
            <span className="fa-label fa-label-dim">What it used to take</span>
            {ITEMS.map((it, i) => (
              <button
                key={i}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`fa-tab-${i}`}
                aria-selected={sel === i}
                aria-controls="fa-answer"
                className={`fa-row${sel === i ? ' is-sel' : ''}`}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="fa-row-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fa-row-txt">{it.old}</span>
              </button>
            ))}
          </div>

          <div className="fa-answercol">
            <span className="fa-label fa-label-rose">What Sssion does</span>
            <div className="fa-answerbox" id="fa-answer" role="tabpanel" aria-labelledby={`fa-tab-${sel}`}>
              <p className="fa-answer" key={sel} aria-live="polite">
                {ITEMS[sel].answer}
              </p>
              <div className="fa-counter">
                <span className="fa-counter-rule" aria-hidden />
                <span className="fa-counter-txt">{ROMAN[sel]} of five</span>
              </div>
            </div>
          </div>
        </div>

        <p className="fa-closing">
          Their phone, their laptop, the studio&apos;s TV. Your members can get to it wherever they
          practice.
        </p>

        <div className="fa-cta-row">
          <a href="/signup" className="fa-cta">
            Start free today
          </a>
          <span className="fa-note">Free while we build. Your Space begins unlisted.</span>
        </div>
      </div>

      {/* ══════════ MOBILE — accordion ══════════ */}
      <div className="fa-wrap fa-mobile">
        <span className="fa-eyebrow">One space, not five tabs</span>
        <h2 className="fa-h">It used to take five apps. Now it takes a Space.</h2>
        <p className="fa-m-sub">Everything you were taping together — in one place you own.</p>

        <div className="fa-cards">
          {ITEMS.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={`fa-card${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="fa-card-btn"
                  aria-expanded={isOpen}
                  aria-controls={`fa-body-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="fa-card-old">{it.old}</span>
                  <span className="fa-card-sign" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div className="fa-card-body" id={`fa-body-${i}`} role="region" aria-labelledby={`fa-tab-m-${i}`}>
                  {it.answer}
                </div>
              </div>
            )
          })}
        </div>

        <p className="fa-closing">
          Their phone, their laptop, the studio&apos;s TV. Your members can get to it wherever they
          practice.
        </p>

        <div className="fa-cta-row">
          <a href="/signup" className="fa-cta">
            Start free today
          </a>
          <span className="fa-note">Free while we build. Your Space begins unlisted.</span>
        </div>
      </div>
    </section>
  )
}
