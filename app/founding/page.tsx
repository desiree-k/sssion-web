import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import RedesignInteractions from '../RedesignInteractions'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' })

const APP_STORE = 'https://apps.apple.com/us/app/sssion/id6763607808'
// Founding Studios are full — the founding CTAs now funnel to the homepage waitlist.
const WAITLIST_HREF = '/#waitlist'

export const metadata: Metadata = {
  title: 'Founding Studios | Sssion',
  description:
    'The first 50 creators building Sssion with us. Apply to become a Founding Studio — free for good, built together.',
}

const DISCIPLINES = [
  'Pole', 'Flexibility', 'Floor work', 'Heels', 'Contemporary', 'Yoga & flow', 'Strength',
]

const BENEFITS = [
  { n: '01', d: 40, h: 'Free for good', p: 'Your space stays free — no fees, no expiry date.' },
  { n: '02', d: 100, h: 'A founding badge', p: 'A permanent mark that you were here first.' },
  { n: '03', d: 160, h: 'First access to everything', p: 'New tools reach you before anyone else.' },
  { n: '04', d: 40, h: 'A real say', p: 'Shape the roadmap — we build with your input.' },
  { n: '05', d: 100, h: 'A direct line to the founder', p: 'Talk to the person building this, directly.' },
  { n: '06', d: 160, h: 'First dibs on referral rewards', p: 'Be first in line as referral rewards roll out.' },
]

const css = `
@keyframes ss-kb{0%{transform:scale(1.04) translate(0,0)}100%{transform:scale(1.18) translate(-2%,-3%)}}
@keyframes ss-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-4%)}60%{transform:translate(-3%,-2%)}80%{transform:translate(4%,2%)}100%{transform:translate(0,0)}}
@keyframes ss-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
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

/* Founding-full announcement banner */
.ss-fs-banner{position:absolute;top:clamp(78px,12vw,98px);left:50%;transform:translateX(-50%);z-index:20;display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center;width:max-content;max-width:calc(100% - 32px);padding:11px 12px 11px 20px;border-radius:999px;background:rgba(26,26,46,.72);border:1px solid rgba(183,110,121,.5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 12px 40px -14px rgba(0,0,0,.6);text-align:center}
.ss-fs-banner-dot{width:8px;height:8px;border-radius:50%;background:#B76E79;box-shadow:0 0 12px #B76E79;flex:none}
.ss-fs-banner-text{font-size:clamp(13px,1.6vw,15px);color:#EAEAF2;font-weight:500}
.ss-fs-banner-text strong{color:#fff;font-weight:700}
.ss-fs-banner-cta{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:999px;background:linear-gradient(135deg,#C98693,#B76E79);color:#1A1A2E;font-weight:700;font-size:14px;white-space:nowrap;transition:transform .2s ease}
.ss-fs-banner-cta:hover{transform:translateY(-1px)}

/* Hero */
.ss-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;overflow:hidden}
.ss-hero-media{position:absolute;inset:-6% 0;z-index:0;will-change:transform}
.ss-hero-kb{position:absolute;inset:0;animation:ss-kb 22s ease-in-out infinite alternate}
.ss-hero-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(26,26,46,.66) 0%,rgba(26,26,46,.15) 26%,rgba(26,26,46,.2) 50%,rgba(26,26,46,.85) 80%,#1A1A2E 100%)}
.ss-hero-inner{position:relative;z-index:10;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(72px,11vw,120px)}
.ss-hero-copy{max-width:820px}
.ss-badge{display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.28em;text-transform:uppercase;color:#D89AA3;margin-bottom:clamp(18px,2.6vw,24px);padding:8px 15px;border:1px solid rgba(183,110,121,.45);border-radius:999px}
.ss-badge-dot{width:7px;height:7px;border-radius:50%;background:#B76E79;box-shadow:0 0 12px #B76E79}
.ss-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(52px,11vw,124px);line-height:.9;letter-spacing:-.035em;margin:0 0 clamp(18px,2.6vw,26px);text-wrap:balance}
.ss-hero-sub{font-size:clamp(18px,2.6vw,26px);line-height:1.4;color:#D3D3DE;margin:0 0 clamp(28px,3.6vw,38px);max-width:560px}
.ss-scrollcue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:7px;pointer-events:none}
.ss-scrollcue span{font-weight:600;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#9999AA}

/* Sections */
.ss-section{position:relative;padding:clamp(80px,13vw,168px) clamp(20px,5vw,64px)}
.ss-wrap{max-width:1180px;margin:0 auto}
.ss-eyebrow2{font-weight:600;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#B76E79;margin-bottom:22px}
.ss-h2{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(30px,5.4vw,58px);line-height:1.05;letter-spacing:-.03em;margin:0;text-wrap:balance}

/* Buttons */
.ss-btn-primary{display:inline-flex;align-items:center;gap:11px;padding:17px 34px;border-radius:14px;background:linear-gradient(135deg,#C98693,#B76E79);color:#1A1A2E;font-weight:700;font-size:clamp(16px,2vw,18px);box-shadow:0 14px 34px -10px rgba(183,110,121,.6);transition:transform .25s ease,box-shadow .25s ease}
.ss-btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 44px -10px rgba(183,110,121,.78)}

/* Intro */
.ss-intro{max-width:900px;margin:0 auto}
.ss-intro-lead{font-size:clamp(19px,2.6vw,27px);line-height:1.5;color:#D3D3DE;margin:0 0 clamp(28px,3.6vw,40px);text-wrap:pretty}
.ss-intro-big{font-family:var(--font-bricolage),sans-serif;font-weight:500;font-size:clamp(24px,4vw,44px);line-height:1.2;letter-spacing:-.02em;color:#fff;margin:0;text-wrap:balance}

/* What you get */
.ss-fs-head{max-width:680px;margin-bottom:clamp(44px,6vw,68px)}
.ss-fs-lead{font-size:clamp(18px,2.4vw,24px);line-height:1.5;color:#D3D3DE;margin:0;text-wrap:pretty}
.ss-fs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(16px,2vw,22px)}
.ss-fs-card{padding:clamp(28px,3vw,36px);border-radius:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);transition:transform .3s ease,border-color .3s ease}
.ss-fs-card:hover{transform:translateY(-6px);border-color:rgba(183,110,121,.45)}
.ss-fs-card .num{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:14px;color:#B76E79;margin-bottom:20px}
.ss-fs-card h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(22px,2.6vw,27px);line-height:1.05;letter-spacing:-.02em;margin:0 0 10px}
.ss-fs-card p{font-size:15.5px;line-height:1.6;color:#9999AA;margin:0}

/* Why only 50 */
.ss-fifty{position:relative;padding:clamp(96px,16vw,200px) clamp(20px,5vw,64px);background:#1A1A2E;overflow:hidden;text-align:center}
.ss-fifty-watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--font-bricolage),sans-serif;font-weight:800;font-size:clamp(240px,44vw,540px);line-height:1;color:rgba(183,110,121,.06);z-index:0;pointer-events:none;user-select:none}
.ss-fifty-inner{position:relative;z-index:10;max-width:820px;margin:0 auto}
.ss-fifty-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(30px,6vw,64px);line-height:1.05;letter-spacing:-.03em;color:#fff;margin:0;text-wrap:balance}

/* Looking for + marquee */
.ss-look{position:relative;padding:clamp(80px,13vw,168px) 0;background:#2A2A3E}
.ss-look-head{max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,64px);text-align:center}
.ss-look-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(30px,5.4vw,58px);line-height:1.05;letter-spacing:-.03em;margin:0 0 40px;text-wrap:balance}
.ss-marquee-wrap{overflow:hidden;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);padding:20px 0;margin-top:8px}
.ss-marquee{display:flex;width:max-content;animation:ss-marquee 30s linear infinite;font-family:var(--font-bricolage),sans-serif;font-weight:600;font-size:clamp(20px,3vw,34px);color:#9999AA;white-space:nowrap}
.ss-marquee-group{display:flex;gap:34px;padding-right:34px;align-items:center}
.ss-marquee .sep{color:#B76E79}

/* Closing CTA */
.ss-closing{position:relative;min-height:80svh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:clamp(80px,12vw,140px) clamp(20px,5vw,64px)}
.ss-closing-bg{position:absolute;inset:0;z-index:0;animation:ss-kb 26s ease-in-out infinite alternate}
.ss-closing-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,#2A2A3E 0%,rgba(26,26,46,.74) 34%,rgba(26,26,46,.76) 66%,#1A1A2E 100%)}
.ss-closing-inner{position:relative;z-index:10;text-align:center;max-width:820px}
.ss-closing-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(36px,7vw,80px);line-height:1;letter-spacing:-.035em;margin:0 0 clamp(30px,4vw,42px);text-wrap:balance}
.ss-closing-note{font-size:15px;line-height:1.6;color:#9999AA;margin:24px 0 0}

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

@media(prefers-reduced-motion:reduce){.ss-marquee,.ss-hero-kb,.ss-closing-bg,.ss-grain,.ss-badge-dot{animation:none}}
`

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 384 512" fill="#fff" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

const MarqueeGroup = ({ hidden = false }: { hidden?: boolean }) => (
  <span className="ss-marquee-group" aria-hidden={hidden || undefined}>
    {DISCIPLINES.map((d) => (
      <span key={d} style={{ display: 'contents' }}>
        <span>{d}</span>
        <span className="sep">·</span>
      </span>
    ))}
    <span className="ss-accent">every movement in between</span>
    <span className="sep">·</span>
  </span>
)

export default function FoundingPage() {
  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ss-home" id="top">
        {/* ================= HEADER ================= */}
        <header id="ss-header" className="ss-header">
          <a href="/" className="ss-logo">sssion</a>
          <nav className="ss-nav">
            <a href="/features" className="ss-navlink">Features &amp; Pricing</a>
            <a href="/studios" className="ss-navlink">For Studios</a>
            <a href="/discover" className="ss-navlink">Discover</a>
            <a href="/blog" className="ss-navlink">Blog</a>
            <a href={WAITLIST_HREF} className="ss-navpill">Join waitlist</a>
          </nav>
        </header>

        {/* ================= HERO ================= */}
        <section className="ss-hero">
          <div id="ss-hero-media" className="ss-hero-media">
            <div className="ss-hero-kb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-fs-hero.webp" alt="" aria-hidden="true" />
            </div>
          </div>
          <div id="ss-hero-scrim" className="ss-hero-scrim" />
          <div className="ss-grain" />

          {/* Founding Studios are full — funnel new interest to the homepage waitlist */}
          <div className="ss-fs-banner">
            <span className="ss-fs-banner-dot" aria-hidden="true" />
            <span className="ss-fs-banner-text">
              <strong>Founding creator program is full.</strong> The founding class is complete.
            </span>
            <a href={WAITLIST_HREF} className="ss-fs-banner-cta">Join the waitlist →</a>
          </div>

          <div style={{ flex: 1 }} />
          <div className="ss-hero-inner">
            <div className="ss-hero-copy">
              <div data-reveal className="ss-badge">
                <span className="ss-badge-dot" />50 spaces · by application
              </div>
              <h1 data-reveal data-reveal-delay="80" className="ss-h1">
                Founding<br />
                <span className="ss-accent">Studios</span>
              </h1>
              <p data-reveal data-reveal-delay="180" className="ss-hero-sub">
                The first 50 creators building Sssion with us.
              </p>
              <a data-reveal data-reveal-delay="280" href={WAITLIST_HREF} className="ss-btn-primary">
                Join the waitlist <span>→</span>
              </a>
            </div>
          </div>

          <div className="ss-scrollcue">
            <span>Scroll</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9999AA" strokeWidth="2" style={{ animation: 'ss-scroll 1.8s ease-in-out infinite' }} aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>

        {/* ================= INTRO ================= */}
        <section className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-intro">
            <p data-reveal className="ss-intro-lead">
              Sssion is a private space platform built for movement and dance creators — the people
              mainstream platforms shadowban, demonetize, and slap content warnings on for doing their art.
            </p>
            <p data-reveal data-reveal-delay="120" className="ss-intro-big">
              We&apos;re opening the doors to our first 50 Founding Studios.{' '}
              <span className="ss-accent">Not a beta test — a founding class.</span>{' '}
              The creators who get in now will shape what this platform becomes.
            </p>
          </div>
        </section>

        {/* ================= WHAT YOU GET ================= */}
        <section className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap">
            <div className="ss-fs-head">
              <div data-reveal className="ss-eyebrow2">What you get</div>
              <p data-reveal data-reveal-delay="80" className="ss-fs-lead">
                Your own private space — a place to teach sessions, gather your community, or both.
                Your content, your people, your rules, your pricing.{' '}
                <span style={{ color: '#fff', fontWeight: 600 }}>We&apos;re the infrastructure, not the landlord.</span>
              </p>
            </div>
            <div className="ss-fs-cards">
              {BENEFITS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="ss-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHY ONLY 50 ================= */}
        <section className="ss-fifty">
          <div aria-hidden="true" className="ss-fifty-watermark">50</div>
          <div className="ss-fifty-inner">
            <div data-reveal className="ss-eyebrow2" style={{ marginBottom: 26 }}>Why only 50</div>
            <p data-reveal data-reveal-delay="100" className="ss-fifty-h">
              Because we onboard every Founding Studio <span className="ss-accent">personally.</span>
            </p>
          </div>
        </section>

        {/* ================= WHAT WE'RE LOOKING FOR ================= */}
        <section className="ss-look">
          <div className="ss-look-head">
            <div data-reveal className="ss-eyebrow2">What we&apos;re looking for</div>
            <h2 data-reveal data-reveal-delay="80" className="ss-look-h">
              Movement creators who take their craft and their community seriously.
            </h2>
          </div>
          <div data-reveal data-reveal-delay="140" className="ss-marquee-wrap">
            <div className="ss-marquee">
              <MarqueeGroup />
              <MarqueeGroup hidden />
            </div>
          </div>
        </section>

        {/* ================= CLOSING CTA ================= */}
        <section className="ss-closing">
          {/* No dedicated CTA image was provided in the design; reusing the hero shot. */}
          <div className="ss-closing-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ss-img" src="/redesign/ss-fs-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="ss-closing-scrim" />
          <div className="ss-grain" />
          <div className="ss-closing-inner">
            <h2 data-reveal className="ss-closing-h">
              Your body. Your art.<br />
              <span className="ss-accent">Your space.</span>
            </h2>
            <a data-reveal data-reveal-delay="120" href={WAITLIST_HREF} className="ss-btn-primary" style={{ padding: '18px 40px', fontSize: 'clamp(16px,2vw,19px)' }}>
              Join the waitlist <span>→</span>
            </a>
            <p data-reveal data-reveal-delay="200" className="ss-closing-note">
              Founding creator program is full — join the waitlist and we&apos;ll open your door as spots open.
            </p>
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
              <a href="/studios" className="ss-footer-link">For Studios</a>
              <a href="/features" className="ss-footer-link">Features &amp; Pricing</a>
              <a href="/discover" className="ss-footer-link">Discover Creators</a>
              <a href="/blog" className="ss-footer-link">Blog</a>
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
