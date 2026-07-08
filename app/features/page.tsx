import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import RedesignInteractions from '../RedesignInteractions'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' })

const APP_STORE = 'https://apps.apple.com/us/app/sssion/id6763607808'
const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

export const metadata: Metadata = {
  title: 'Features & Pricing | Sssion',
  description:
    'Building a community on Sssion is free — and the core of what we do always will be. Grow with paid tools only when you are ready.',
}

const css = `
@keyframes ss-kb{0%{transform:scale(1.04) translate(0,0)}100%{transform:scale(1.18) translate(-2%,-3%)}}
@keyframes ss-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-4%)}60%{transform:translate(-3%,-2%)}80%{transform:translate(4%,2%)}100%{transform:translate(0,0)}}
@keyframes ss-scroll{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(7px);opacity:1}}
@keyframes ss-pulse{0%,100%{box-shadow:0 0 0 0 rgba(183,110,121,.5)}50%{box-shadow:0 0 0 6px rgba(183,110,121,0)}}

.ss-home{position:relative;width:100%;overflow-x:hidden;background:#1A1A2E;color:#fff;font-family:var(--font-hanken),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ss-home *{box-sizing:border-box}
.ss-accent{font-style:italic;color:#C88793}
.ss-img{width:100%;height:100%;object-fit:cover;display:block}
.ss-grain{position:absolute;inset:-40%;z-index:6;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:ss-grain 5s steps(6) infinite}

/* Header */
.ss-header{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(16px,3vw,24px) clamp(20px,5vw,64px);transition:background .4s ease,backdrop-filter .4s ease,border-color .4s ease;border-bottom:1px solid transparent}
.ss-logo{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(20px,2.4vw,24px);letter-spacing:.02em;color:#fff}
.ss-nav{display:flex;align-items:center;gap:clamp(14px,2.4vw,30px)}
.ss-navlink{color:#C9C9D6;font-size:14px;font-weight:500;display:none}
.ss-navlink:hover{color:#fff}
@media(min-width:760px){.ss-navlink{display:inline-flex}}
.ss-navpill{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:14px;font-weight:600;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .25s ease}
.ss-navpill:hover{background:rgba(255,255,255,.16)}

/* Hero */
.ss-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;overflow:hidden}
.ss-hero-media{position:absolute;inset:-6% 0;z-index:0;will-change:transform}
.ss-hero-kb{position:absolute;inset:0;animation:ss-kb 22s ease-in-out infinite alternate}
.ss-hero-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(26,26,46,.62) 0%,rgba(26,26,46,.12) 26%,rgba(26,26,46,.18) 50%,rgba(26,26,46,.84) 80%,#1A1A2E 100%)}
.ss-hero-inner{position:relative;z-index:10;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(72px,11vw,120px)}
.ss-hero-copy{max-width:760px}
.ss-eyebrow{font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.34em;text-transform:uppercase;color:#D89AA3;margin-bottom:clamp(16px,2.4vw,22px)}
.ss-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(54px,11vw,128px);line-height:.9;letter-spacing:-.035em;margin:0 0 clamp(18px,2.6vw,26px);text-wrap:balance}
.ss-hero-sub{font-size:clamp(17px,2.3vw,23px);line-height:1.5;color:#D3D3DE;margin:0;max-width:560px}
.ss-scrollcue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:7px;pointer-events:none}
.ss-scrollcue span{font-weight:600;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#9999AA}

/* Section shells */
.ss-section{position:relative;padding:clamp(80px,13vw,168px) clamp(20px,5vw,64px)}
.ss-wrap{max-width:1180px;margin:0 auto}
.ss-eyebrow2{font-weight:600;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#B76E79;margin-bottom:22px}
.ss-h2{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(30px,5.2vw,56px);line-height:1.03;letter-spacing:-.03em;margin:0 0 20px;text-wrap:balance}
.ss-body{font-size:clamp(16px,2vw,19px);line-height:1.6;color:#B9B9C6;margin:0}
.ss-arrowlink{display:inline-flex;align-items:center;gap:10px;font-size:clamp(16px,2vw,18px);font-weight:700;color:#D89AA3;transition:gap .25s ease,color .25s ease}
.ss-arrowlink:hover{gap:16px;color:#E8B4BC}

/* Buttons */
.ss-btn-primary{padding:16px 32px;border-radius:14px;background:linear-gradient(135deg,#C98693,#B76E79);color:#1A1A2E;font-weight:700;font-size:clamp(15px,1.9vw,17px);box-shadow:0 12px 30px -8px rgba(183,110,121,.6);transition:transform .25s ease,box-shadow .25s ease}
.ss-btn-primary:hover{transform:translateY(-2px);box-shadow:0 18px 40px -8px rgba(183,110,121,.75)}
.ss-btn-glass{padding:16px 32px;border-radius:14px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.26);color:#fff;font-weight:600;font-size:clamp(15px,1.9vw,17px);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .25s ease}
.ss-btn-glass:hover{background:rgba(255,255,255,.18)}

/* Grow cards */
.ss-fp-head{max-width:680px;margin-bottom:clamp(44px,6vw,68px)}
.ss-fp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(16px,2vw,22px)}
.ss-fp-card{position:relative;padding:clamp(28px,3vw,38px);border-radius:22px;background:#2A2A3E;border:1px solid rgba(255,255,255,.06);transition:transform .3s ease,border-color .3s ease}
.ss-fp-card:hover{transform:translateY(-6px);border-color:rgba(183,110,121,.4)}
.ss-coming{display:inline-block;font-weight:600;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#B76E79;border:1px solid rgba(183,110,121,.4);border-radius:999px;padding:5px 11px;margin-bottom:22px}
.ss-fp-card h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(22px,2.8vw,28px);line-height:1.05;letter-spacing:-.02em;margin:0 0 12px}
.ss-fp-card p{font-size:15.5px;line-height:1.6;color:#9999AA;margin:0}

/* Studio */
.ss-studio-wrap{display:flex;flex-wrap:wrap;gap:clamp(40px,6vw,80px);align-items:center}
.ss-studio-text{flex:1 1 400px;min-width:280px}
.ss-studio-media{position:relative;flex:1 1 340px;min-width:280px;aspect-ratio:4/3;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -24px rgba(0,0,0,.6)}

/* Promise */
.ss-promise{max-width:1000px}
.ss-promise-row{display:flex;gap:clamp(18px,3vw,36px);align-items:flex-start;padding:clamp(24px,3.4vw,40px) 0;border-top:1px solid rgba(255,255,255,.1)}
.ss-promise-row:last-child{border-bottom:1px solid rgba(255,255,255,.1)}
.ss-promise-num{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(15px,1.8vw,18px);color:#B76E79;padding-top:6px;flex:none}
.ss-promise-h{font-family:var(--font-bricolage),sans-serif;font-weight:600;font-size:clamp(24px,4.4vw,46px);line-height:1.08;letter-spacing:-.025em;margin:0;text-wrap:balance}

/* Roadmap */
.ss-road-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(20px,3vw,36px)}
.ss-road-col{position:relative;padding-top:28px}
.ss-road-dot{position:absolute;top:-9px;left:0;width:16px;height:16px;border-radius:50%}
.ss-road-title{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(26px,3.4vw,34px);letter-spacing:-.02em;margin-bottom:18px}
.ss-road-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.ss-road-list li{font-size:16px;display:flex;gap:10px}

/* Closing CTA */
.ss-closing{position:relative;min-height:70svh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:clamp(80px,12vw,140px) clamp(20px,5vw,64px)}
.ss-closing-bg{position:absolute;inset:0;z-index:0;animation:ss-kb 26s ease-in-out infinite alternate}
.ss-closing-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,#2A2A3E 0%,rgba(26,26,46,.74) 34%,rgba(26,26,46,.76) 66%,#1A1A2E 100%)}
.ss-closing-inner{position:relative;z-index:10;text-align:center;max-width:820px}
.ss-closing-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(34px,6.5vw,72px);line-height:1;letter-spacing:-.035em;margin:0 0 clamp(30px,4vw,44px);text-wrap:balance}
.ss-closing-cta{display:flex;flex-wrap:wrap;gap:13px;justify-content:center}

/* Footer */
.ss-footer{background:#14141f;padding:clamp(56px,8vw,88px) clamp(20px,5vw,64px) clamp(36px,5vw,48px);border-top:1px solid rgba(255,255,255,.06);font-family:var(--font-hanken),system-ui,sans-serif;color:#fff}
.ss-footer-top{max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;justify-content:space-between}
.ss-footer-brand{flex:1 1 260px;min-width:240px}
.ss-footer-logo{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:26px;letter-spacing:.02em;margin-bottom:12px}
.ss-footer-tagline{font-family:var(--font-bricolage),sans-serif;font-style:italic;font-size:18px;color:#B76E79;margin:0 0 24px}
.ss-footer-cols{display:flex;flex-wrap:wrap;gap:clamp(40px,6vw,72px)}
.ss-footer-col{display:flex;flex-direction:column;gap:14px}
.ss-footer-label{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#6d6d80;margin-bottom:4px}
.ss-footer-link{color:#C9C9D6;font-size:15px;font-weight:500;transition:color .2s ease}
.ss-footer-link:hover{color:#fff}
.ss-footer-bottom{max-width:1180px;margin:48px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,.06);display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;font-size:13px;color:#6d6d80}
.ss-appstore{display:inline-flex;align-items:center;gap:11px;padding:11px 18px;border-radius:13px;background:#000;border:1px solid rgba(255,255,255,.18);transition:border-color .25s ease}
.ss-appstore:hover{border-color:rgba(255,255,255,.4)}
.ss-appstore .l1{font-size:9px;color:#c9c9d6;letter-spacing:.05em}
.ss-appstore .l2{font-size:15px;color:#fff;font-weight:600}
`

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 384 512" fill="#fff" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

export default function FeaturesPage() {
  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ss-home" id="top">
        {/* ================= HEADER ================= */}
        <header id="ss-header" className="ss-header">
          <a href="/" className="ss-logo">sssion</a>
          <nav className="ss-nav">
            <a href="/founding" className="ss-navlink">Founding Studios</a>
            <a href="/discover" className="ss-navlink">Discover</a>
            <a href={APP_STORE} target="_blank" rel="noopener" className="ss-navpill">Get the app</a>
          </nav>
        </header>

        {/* ================= HERO ================= */}
        <section className="ss-hero">
          <div id="ss-hero-media" className="ss-hero-media">
            <div className="ss-hero-kb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-fp-hero.webp" alt="" aria-hidden="true" />
            </div>
          </div>
          <div id="ss-hero-scrim" className="ss-hero-scrim" />
          <div className="ss-grain" />

          <div style={{ flex: 1 }} />
          <div className="ss-hero-inner">
            <div className="ss-hero-copy">
              <div data-reveal className="ss-eyebrow">Features &amp; pricing</div>
              <h1 data-reveal data-reveal-delay="80" className="ss-h1">
                Start free.<br />
                <span className="ss-accent">Always.</span>
              </h1>
              <p data-reveal data-reveal-delay="180" className="ss-hero-sub">
                Building a community on Sssion is free — and the core of what we do always will be.
              </p>
            </div>
          </div>

          <div className="ss-scrollcue">
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9999AA" strokeWidth="2" style={{ animation: 'ss-scroll 1.8s ease-in-out infinite' }} aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>

        {/* ================= GROW WHEN YOU'RE READY ================= */}
        <section className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-wrap">
            <div className="ss-fp-head">
              <div data-reveal className="ss-eyebrow2">Grow when you&apos;re ready</div>
              <h2 data-reveal data-reveal-delay="80" className="ss-h2">More, only when you want it.</h2>
              <p data-reveal data-reveal-delay="160" className="ss-body">
                Some creators reach a point where they want more — to earn from their work, to scale,
                to run something bigger.
              </p>
            </div>
            <div className="ss-fp-cards">
              {[
                { d: 40, h: 'Earn from your community', p: 'Payments, paid sessions, and memberships.' },
                { d: 100, h: 'Scale your content', p: 'Unlimited sessions, more storage, deeper tools.' },
                { d: 160, h: 'Understand your growth', p: 'Analytics and insights that actually help.' },
                { d: 40, h: 'Run multiple spaces', p: 'Separate communities by location, level, or instructor.' },
              ].map((c) => (
                <div key={c.h} data-reveal data-reveal-delay={c.d} className="ss-fp-card">
                  <span className="ss-coming">Coming</span>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOR PHYSICAL STUDIOS ================= */}
        <section className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap ss-studio-wrap">
            <div className="ss-studio-text">
              <div data-reveal className="ss-eyebrow2">For physical studios</div>
              <h2 data-reveal data-reveal-delay="80" className="ss-h2">
                An extension of your studio — not a competitor.
              </h2>
              <p data-reveal data-reveal-delay="160" className="ss-body" style={{ color: '#C4C4D0', lineHeight: 1.65, maxWidth: 520, marginBottom: 32 }}>
                If you run a studio or teach in person, Sssion isn&apos;t here to compete with you —
                it&apos;s here to extend what you already do.
              </p>
              <a data-reveal data-reveal-delay="220" href={STUDIO_MAILTO} className="ss-arrowlink">
                Reach out <span style={{ fontSize: '1.1em' }}>→</span>
              </a>
            </div>
            <div data-reveal data-reveal-delay="120" className="ss-studio-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-fp-studio.webp" alt="An in-person movement class" />
            </div>
          </div>
        </section>

        {/* ================= OUR PROMISE ================= */}
        <section className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-wrap ss-promise">
            <div data-reveal className="ss-eyebrow2" style={{ marginBottom: 'clamp(36px,5vw,56px)' }}>Our promise</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div data-reveal className="ss-promise-row">
                <span className="ss-promise-num">01</span>
                <h3 className="ss-promise-h">The community core stays free.</h3>
              </div>
              <div data-reveal data-reveal-delay="80" className="ss-promise-row">
                <span className="ss-promise-num">02</span>
                <h3 className="ss-promise-h">We&apos;ll never take a cut of what you earn.</h3>
              </div>
              <div data-reveal data-reveal-delay="80" className="ss-promise-row">
                <span className="ss-promise-num">03</span>
                <h3 className="ss-promise-h">
                  Paid tools are for when you&apos;re ready —{' '}
                  <span style={{ color: '#C88793' }}>never a wall in front of getting started.</span>
                </h3>
              </div>
              <div data-reveal data-reveal-delay="80" className="ss-promise-row">
                <span className="ss-promise-num">04</span>
                <h3 className="ss-promise-h">
                  We&apos;re building the paid layer{' '}
                  <span style={{ color: '#C88793' }}>with our creators, not at them.</span>
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHERE WE'RE HEADED ================= */}
        <section className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap ss-promise">
            <div data-reveal className="ss-eyebrow2" style={{ marginBottom: 'clamp(40px,6vw,64px)' }}>Where we&apos;re headed</div>
            <div className="ss-road-grid">
              <div data-reveal className="ss-road-col" style={{ borderTop: '2px solid #B76E79' }}>
                <span className="ss-road-dot" style={{ background: '#B76E79', animation: 'ss-pulse 2.4s ease-in-out infinite' }} />
                <div className="ss-road-title">Now</div>
                <ul className="ss-road-list">
                  {['Free community spaces', 'Content hosting', 'Live sessions', 'Discovery'].map((t) => (
                    <li key={t} style={{ color: '#D3D3DE' }}><span style={{ color: '#B76E79' }}>—</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div data-reveal data-reveal-delay="100" className="ss-road-col" style={{ borderTop: '2px solid rgba(183,110,121,.5)' }}>
                <span className="ss-road-dot" style={{ background: '#2A2A3E', border: '2px solid #B76E79' }} />
                <div className="ss-road-title" style={{ color: '#D89AA3' }}>Soon</div>
                <ul className="ss-road-list">
                  {['Payments', 'Paid memberships'].map((t) => (
                    <li key={t} style={{ color: '#B9B9C6' }}><span style={{ color: '#B76E79' }}>—</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div data-reveal data-reveal-delay="200" className="ss-road-col" style={{ borderTop: '2px solid rgba(255,255,255,.14)' }}>
                <span className="ss-road-dot" style={{ background: '#2A2A3E', border: '2px solid rgba(255,255,255,.3)' }} />
                <div className="ss-road-title" style={{ color: '#9999AA' }}>Ahead</div>
                <ul className="ss-road-list">
                  {['Analytics', 'Multiple spaces', 'Tools for studios'].map((t) => (
                    <li key={t} style={{ color: '#9999AA' }}><span style={{ color: '#7a6a72' }}>—</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="ss-closing">
          {/* No dedicated CTA image was provided in the design; reusing the hero movement shot. */}
          <div className="ss-closing-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ss-img" src="/redesign/ss-fp-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="ss-closing-scrim" />
          <div className="ss-grain" />
          <div className="ss-closing-inner">
            <h2 data-reveal className="ss-closing-h">
              Start free. <span className="ss-accent">Grow when you&apos;re ready.</span>
            </h2>
            <div data-reveal data-reveal-delay="120" className="ss-closing-cta">
              <a href="/join" className="ss-btn-primary">Start your free community →</a>
              <a href={STUDIO_MAILTO} className="ss-btn-glass">Talk to us about studios →</a>
            </div>
          </div>
        </section>
      </div>

      <RedesignInteractions />

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* Footer (matches homepage; all links preserved) */}
      <footer className="ss-footer">
        <div className="ss-footer-top">
          <div className="ss-footer-brand">
            <div className="ss-footer-logo">sssion</div>
            <p className="ss-footer-tagline">Own your movement.</p>
            <a href={APP_STORE} target="_blank" rel="noopener" className="ss-appstore">
              <AppleLogo />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                <span className="l1">Download on the</span>
                <span className="l2">App Store</span>
              </span>
            </a>
          </div>
          <div className="ss-footer-cols">
            <div className="ss-footer-col">
              <span className="ss-footer-label">Platform</span>
              <a href="/founding" className="ss-footer-link">Founding Studios</a>
              <a href="/features" className="ss-footer-link">Features &amp; Pricing</a>
              <a href="/discover" className="ss-footer-link">Discover Creators</a>
            </div>
            <div className="ss-footer-col">
              <span className="ss-footer-label">Account</span>
              <a href="/signin" className="ss-footer-link">Creator Sign In</a>
              <a href="/student-signin" className="ss-footer-link">Student Sign In</a>
            </div>
            <div className="ss-footer-col">
              <span className="ss-footer-label">Legal</span>
              <a href="/privacy" className="ss-footer-link">Privacy</a>
              <a href="/terms" className="ss-footer-link">Terms</a>
            </div>
          </div>
        </div>
        <div className="ss-footer-bottom">
          <span>&copy; 2026 Sssion. Your body. Your art. Your space.</span>
          <span>Made for movement.</span>
        </div>
      </footer>
    </div>
  )
}
