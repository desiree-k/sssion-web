import type { Metadata } from 'next'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import VideoWell from '@/components/marketing/VideoWell'
import IvoryInteractions from '@/components/marketing/IvoryInteractions'
import {
  MARKETING_CSS,
  marketingFontVars,
  MarketingNav,
  MarketingFooter,
} from '@/components/marketing/MarketingChrome'

const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

export const metadata: Metadata = {
  title: 'Features & Pricing | Sssion',
  description:
    'Building a community on Sssion is free — and the core of what we do always will be. Grow with paid tools only when you are ready.',
}

const GROW = [
  { d: 40, h: 'Earn from your community', p: 'Payments, paid sessions, and memberships.' },
  { d: 100, h: 'Scale your content', p: 'Unlimited sessions, more storage, deeper tools.' },
  { d: 160, h: 'Understand your growth', p: 'Analytics and insights that actually help.' },
  { d: 40, h: 'Run multiple spaces', p: 'Separate communities by location, level, or instructor.' },
]

const PROMISE = [
  { n: '01', h: <>The community core stays free.</> },
  { n: '02', h: <>We&apos;ll never take a cut of what you earn.</> },
  { n: '03', h: <>Paid tools are for when you&apos;re ready — <span className="mk-accent">never a wall in front of getting started.</span></> },
  { n: '04', h: <>We&apos;re building the paid layer <span className="mk-accent">with our creators, not at them.</span></> },
]

const css = `
@keyframes mk-pulse{0%,100%{box-shadow:0 0 0 0 rgba(158,92,104,.5)}50%{box-shadow:0 0 0 6px rgba(158,92,104,0)}}

.mk-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#000}
.mk-hero-media{position:absolute;inset:-4% 0;z-index:0;will-change:transform}
.mk-hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.06) 30%,rgba(0,0,0,.2) 56%,rgba(0,0,0,.8) 100%)}
.mk-hero-inner{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(60px,10vw,110px)}
.mk-hero-eyebrow{font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.3em;text-transform:uppercase;color:rgba(247,244,239,.72);margin:0 0 20px}
.mk-hero-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(58px,13vw,150px);line-height:.88;letter-spacing:-.03em;margin:0 0 clamp(16px,2.4vw,22px);color:#F7F4EF;text-wrap:balance}
.mk-hero-sub{font-size:clamp(17px,2.2vw,22px);line-height:1.5;color:rgba(247,244,239,.85);margin:0;max-width:520px}

.mk-fp-head{max-width:640px;margin-bottom:clamp(36px,5vw,52px)}
.mk-fp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.mk-fp-card{background:#FFFFFF;border:1px solid #E5E0D6;border-radius:18px;overflow:hidden}
.mk-fp-card-body{padding:clamp(20px,2.4vw,26px)}
.mk-coming{display:inline-flex;font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#9E5C68;border:1px solid #E5E0D6;border-radius:999px;padding:4px 10px;margin-bottom:14px}
.mk-fp-card h3{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(19px,2.3vw,23px);letter-spacing:-.01em;margin:0 0 8px;line-height:1.15}
.mk-fp-card p{font-size:14.5px;line-height:1.55;color:#8D877D;margin:0}

.mk-studio-wrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,80px);align-items:center}
@media(max-width:860px){.mk-studio-wrap{grid-template-columns:1fr}}

.mk-promise{max-width:1000px;margin:0 auto}
.mk-promise-row{display:flex;gap:clamp(16px,3vw,32px);align-items:baseline;padding:clamp(22px,3vw,30px) 0;border-top:1px solid #E5E0D6}
.mk-promise-row:last-child{border-bottom:1px solid #E5E0D6}
.mk-promise-num{font-family:var(--font-fraunces),Georgia,serif;font-size:clamp(15px,2vw,18px);color:#9E5C68;flex:none;width:2.4em}
.mk-promise-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(22px,3.4vw,38px);line-height:1.12;letter-spacing:-.02em;margin:0;text-wrap:balance}

.mk-road-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:clamp(20px,3vw,28px)}
.mk-road-col{position:relative;padding-top:24px}
.mk-road-dot{position:absolute;top:-6px;left:0;width:11px;height:11px;border-radius:50%}
.mk-road-title{font-family:var(--font-fraunces),Georgia,serif;font-size:clamp(20px,2.6vw,26px);margin:0 0 16px}
.mk-road-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:11px}
.mk-road-list li{display:flex;gap:10px;font-size:15.5px;color:#4A463F}

.mk-closing{position:relative;min-height:76svh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000;padding:clamp(72px,11vw,130px) clamp(20px,5vw,64px)}
.mk-closing-media{position:absolute;inset:0;z-index:0}
.mk-closing-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-closing-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35) 45%,rgba(0,0,0,.72))}
.mk-closing-inner{position:relative;z-index:2;text-align:center;max-width:900px}
.mk-closing-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(38px,8vw,92px);line-height:1;letter-spacing:-.03em;margin:0 0 clamp(24px,3.4vw,34px);color:#F7F4EF;text-wrap:balance}
.mk-closing-cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.mk-btn-cream{background:#F7F4EF;color:#1D1B18;border:1px solid #F7F4EF}
.mk-btn-cream:hover{background:#fff;transform:translateY(-1px)}
.mk-btn-ghost{background:transparent;color:#F7F4EF;border:1px solid rgba(247,244,239,.55)}
.mk-btn-ghost:hover{background:rgba(247,244,239,.14)}
`

export default function FeaturesPage() {
  return (
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />

      <div className="mk" id="top">
        <MarketingNav />

        {/* ================= HERO ================= */}
        {/* TODO(footage): full-bleed movement video when licensed; poster stands in now. */}
        <section className="mk-hero">
          <div id="ss-hero-media" className="mk-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-fp-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-hero-scrim" />
          <div className="mk-hero-inner">
            <div data-reveal className="mk-hero-eyebrow">Features &amp; pricing</div>
            <h1 data-reveal data-reveal-delay="80" className="mk-hero-h1">
              Start free.<br />Always.
            </h1>
            <p data-reveal data-reveal-delay="180" className="mk-hero-sub">
              Building a community on Sssion is free — and the core of what we do always will be.
            </p>
          </div>
        </section>

        {/* ================= GROW WHEN YOU'RE READY ================= */}
        <section className="mk-section">
          <div className="mk-wrap">
            <div className="mk-fp-head">
              <div data-reveal className="mk-eyebrow">Grow when you&apos;re ready</div>
              <h2 data-reveal data-reveal-delay="80" className="mk-h2">More, only when you want it.</h2>
              <p data-reveal data-reveal-delay="160" className="mk-body mk-body-2" style={{ maxWidth: 560 }}>
                Some creators reach a point where they want more — to earn from their work, to scale,
                to run something bigger.
              </p>
            </div>
            {/* TODO(footage): each capability gets a small app-UI screen-recording loop; placeholder wells now. */}
            <div className="mk-fp-cards">
              {GROW.map((c) => (
                <div key={c.h} data-reveal data-reveal-delay={c.d} className="mk-fp-card">
                  <VideoWell ratio="16 / 10" label="UI clip coming" />
                  <div className="mk-fp-card-body">
                    <span className="mk-coming">Coming</span>
                    <h3>{c.h}</h3>
                    <p>{c.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOR PHYSICAL STUDIOS ================= */}
        <section className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6', borderBottom: '1px solid #E5E0D6' }}>
          <div className="mk-wrap mk-studio-wrap">
            <div>
              <div data-reveal className="mk-eyebrow">For physical studios</div>
              <h2 data-reveal data-reveal-delay="80" className="mk-h2">
                An extension of your studio — not a competitor.
              </h2>
              <p data-reveal data-reveal-delay="160" className="mk-body mk-body-2" style={{ maxWidth: 520, marginBottom: 28 }}>
                If you run a studio or teach in person, Sssion isn&apos;t here to compete with you —
                it&apos;s here to extend what you already do.
              </p>
              <a data-reveal data-reveal-delay="220" href={STUDIO_MAILTO} className="mk-arrowlink">
                Reach out <span aria-hidden>→</span>
              </a>
            </div>
            <div data-reveal data-reveal-delay="120">
              <VideoWell poster="/redesign/ss-fp-studio.webp" ratio="4 / 5" />
            </div>
          </div>
        </section>

        {/* ================= OUR PROMISE ================= */}
        <section className="mk-section">
          <div className="mk-wrap mk-promise">
            <div data-reveal className="mk-eyebrow" style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>Our promise</div>
            {PROMISE.map((row) => (
              <div key={row.n} data-reveal className="mk-promise-row">
                <span className="mk-promise-num">{row.n}</span>
                <h3 className="mk-promise-h">{row.h}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHERE WE'RE HEADED ================= */}
        <section className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6', borderBottom: '1px solid #E5E0D6' }}>
          <div className="mk-wrap mk-promise">
            <div data-reveal className="mk-eyebrow" style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>Where we&apos;re headed</div>
            <div className="mk-road-grid">
              <div data-reveal className="mk-road-col" style={{ borderTop: '2px solid #9E5C68' }}>
                <span className="mk-road-dot" style={{ background: '#9E5C68', animation: 'mk-pulse 2.4s ease-in-out infinite' }} />
                <div className="mk-road-title">Now</div>
                <ul className="mk-road-list">
                  {['Free community spaces', 'Content hosting', 'Live sessions', 'Discovery'].map((t) => (
                    <li key={t}><span className="mk-accent">—</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div data-reveal data-reveal-delay="100" className="mk-road-col" style={{ borderTop: '2px solid rgba(158,92,104,.5)' }}>
                <span className="mk-road-dot" style={{ background: '#FFFFFF', border: '2px solid #9E5C68' }} />
                <div className="mk-road-title mk-accent">Soon</div>
                <ul className="mk-road-list">
                  {['Payments', 'Paid memberships'].map((t) => (
                    <li key={t} style={{ color: '#8D877D' }}><span className="mk-accent">—</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div data-reveal data-reveal-delay="200" className="mk-road-col" style={{ borderTop: '2px solid #E5E0D6' }}>
                <span className="mk-road-dot" style={{ background: '#FFFFFF', border: '2px solid #C4BEB2' }} />
                <div className="mk-road-title" style={{ color: '#8D877D' }}>Ahead</div>
                <ul className="mk-road-list">
                  {['Analytics', 'Multiple spaces', 'Tools for studios'].map((t) => (
                    <li key={t} style={{ color: '#8D877D' }}><span style={{ color: '#C4BEB2' }}>—</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="mk-closing">
          <div className="mk-closing-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-fp-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-closing-scrim" />
          <div className="mk-closing-inner">
            <h2 data-reveal className="mk-closing-h">Start free. Grow when you&apos;re ready.</h2>
            <div data-reveal data-reveal-delay="120" className="mk-closing-cta">
              <a href="/join" className="mk-btn mk-btn-cream">Start your free community →</a>
              <a href={STUDIO_MAILTO} className="mk-btn mk-btn-ghost">Talk to us about studios →</a>
            </div>
          </div>
        </section>
      </div>

      <IvoryInteractions />
      <MobileDownloadBanner />
      <MarketingFooter />
    </div>
  )
}
