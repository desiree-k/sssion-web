import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import RedesignInteractions from '../RedesignInteractions'
import StudioRoiCalculator from './StudioRoiCalculator'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' })

const APP_STORE = 'https://apps.apple.com/us/app/sssion/id6763607808'
const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

export const metadata: Metadata = {
  title: 'For Studios | Sssion',
  description:
    'Keep your students engaged between classes. Sssion gives your studio an online community hub that protects retention — a supplement to your in-person classes, not a replacement.',
}

const HOW_IT_WORKS = [
  {
    n: '01', d: 40,
    h: 'We set up your Sssion Space',
    p: 'A private online home for your studio, with your name on it. We set it up with you, personally.',
  },
  {
    n: '02', d: 100,
    h: 'Invite your students',
    p: 'Your members join your Space — no algorithm, no strangers, just the people who train with you.',
  },
  {
    n: '03', d: 160,
    h: 'Keep the conversation going',
    p: 'Share content, celebrate progress, keep the community talking between classes.',
  },
  {
    n: '04', d: 220,
    h: 'Students keep the habit',
    p: 'Connected students stay motivated — and motivated students keep showing up to class.',
  },
]

const SOLUTION_POINTS = [
  {
    n: '01', d: 40,
    h: 'A hub, not a rival',
    p: 'Sssion is a supplement to your studio, not a competitor. Everything in your Space points students back to the room.',
  },
  {
    n: '02', d: 100,
    h: 'Community between classes',
    p: 'Your students connect with each other and with you in the days between sessions — the days when the habit slips.',
  },
  {
    n: '03', d: 160,
    h: 'Your content, your people',
    p: 'Post what keeps your community engaged: recaps, drills, wins, announcements. Your Space, your rules.',
  },
]

const css = `
@keyframes ss-kb{0%{transform:scale(1.04) translate(0,0)}100%{transform:scale(1.18) translate(-2%,-3%)}}
@keyframes ss-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-4%)}60%{transform:translate(-3%,-2%)}80%{transform:translate(4%,2%)}100%{transform:translate(0,0)}}
@keyframes ss-scroll{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(7px);opacity:1}}

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
.ss-hero-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(26,26,46,.66) 0%,rgba(26,26,46,.15) 26%,rgba(26,26,46,.2) 50%,rgba(26,26,46,.85) 80%,#1A1A2E 100%)}
.ss-hero-inner{position:relative;z-index:10;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(72px,11vw,120px)}
.ss-hero-copy{max-width:860px}
.ss-badge{display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.28em;text-transform:uppercase;color:#D89AA3;margin-bottom:clamp(18px,2.6vw,24px);padding:8px 15px;border:1px solid rgba(183,110,121,.45);border-radius:999px}
.ss-badge-dot{width:7px;height:7px;border-radius:50%;background:#B76E79;box-shadow:0 0 12px #B76E79}
.ss-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(44px,8.4vw,100px);line-height:.94;letter-spacing:-.035em;margin:0 0 clamp(18px,2.6vw,26px);text-wrap:balance}
.ss-hero-sub{font-size:clamp(18px,2.6vw,25px);line-height:1.4;color:#D3D3DE;margin:0 0 clamp(28px,3.6vw,38px);max-width:620px}
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

/* Problem / intro */
.ss-intro{max-width:900px;margin:0 auto}
.ss-intro-lead{font-size:clamp(19px,2.6vw,27px);line-height:1.5;color:#D3D3DE;margin:0 0 clamp(28px,3.6vw,40px);text-wrap:pretty}
.ss-intro-big{font-family:var(--font-bricolage),sans-serif;font-weight:500;font-size:clamp(24px,4vw,44px);line-height:1.2;letter-spacing:-.02em;color:#fff;margin:0;text-wrap:balance}

/* Cards */
.ss-fs-head{max-width:720px;margin-bottom:clamp(44px,6vw,68px)}
.ss-fs-lead{font-size:clamp(18px,2.4vw,24px);line-height:1.5;color:#D3D3DE;margin:0;text-wrap:pretty}
.ss-fs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(16px,2vw,22px)}
.ss-fs-card{padding:clamp(28px,3vw,36px);border-radius:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);transition:transform .3s ease,border-color .3s ease}
.ss-fs-card:hover{transform:translateY(-6px);border-color:rgba(183,110,121,.45)}
.ss-fs-card .num{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:14px;color:#B76E79;margin-bottom:20px}
.ss-fs-card h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(21px,2.4vw,25px);line-height:1.1;letter-spacing:-.02em;margin:0 0 10px}
.ss-fs-card p{font-size:15.5px;line-height:1.6;color:#9999AA;margin:0}

/* Calculator section */
.ss-calc-head{max-width:760px;margin-bottom:clamp(36px,5vw,52px)}

/* Closing CTA */
.ss-closing{position:relative;min-height:80svh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:clamp(80px,12vw,140px) clamp(20px,5vw,64px)}
.ss-closing-bg{position:absolute;inset:0;z-index:0;animation:ss-kb 26s ease-in-out infinite alternate}
.ss-closing-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,#2A2A3E 0%,rgba(26,26,46,.78) 34%,rgba(26,26,46,.8) 66%,#1A1A2E 100%)}
.ss-closing-inner{position:relative;z-index:10;text-align:center;max-width:860px}
.ss-closing-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(34px,6.4vw,72px);line-height:1;letter-spacing:-.035em;margin:0 0 clamp(22px,3vw,30px);text-wrap:balance}
.ss-closing-sub{font-size:clamp(16px,2.2vw,21px);line-height:1.5;color:#D3D3DE;margin:0 auto clamp(30px,4vw,42px);max-width:600px;text-wrap:pretty}
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

@media(prefers-reduced-motion:reduce){.ss-hero-kb,.ss-closing-bg,.ss-grain,.ss-badge-dot{animation:none}}
`

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 384 512" fill="#fff" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

export default function StudiosPage() {
  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ss-home" id="top">
        {/* ================= HEADER ================= */}
        <header id="ss-header" className="ss-header">
          <a href="/" className="ss-logo">sssion</a>
          <nav className="ss-nav">
            <a href="/features" className="ss-navlink">Features &amp; Pricing</a>
            <a href="/discover" className="ss-navlink">Discover</a>
            <a href="/blog" className="ss-navlink">Blog</a>
            <a href={STUDIO_MAILTO} className="ss-navpill">Talk to us</a>
          </nav>
        </header>

        {/* ================= HERO ================= */}
        <section className="ss-hero">
          <div id="ss-hero-media" className="ss-hero-media">
            <div className="ss-hero-kb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-fp-studio.webp" alt="" aria-hidden="true" />
            </div>
          </div>
          <div id="ss-hero-scrim" className="ss-hero-scrim" />
          <div className="ss-grain" />

          <div style={{ flex: 1 }} />
          <div className="ss-hero-inner">
            <div className="ss-hero-copy">
              <div data-reveal className="ss-badge">
                <span className="ss-badge-dot" />Sssion for Studios
              </div>
              <h1 data-reveal data-reveal-delay="80" className="ss-h1">
                Keep the students you worked <span className="ss-accent">so hard</span> to get.
              </h1>
              <p data-reveal data-reveal-delay="180" className="ss-hero-sub">
                Sssion gives your studio an online community hub that keeps students connected
                between classes — so the habit sticks, and they keep coming back.
              </p>
              <a data-reveal data-reveal-delay="280" href={STUDIO_MAILTO} className="ss-btn-primary">
                Talk to us about your studio <span>→</span>
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

        {/* ================= THE PROBLEM ================= */}
        <section className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-intro">
            <div data-reveal className="ss-eyebrow2">The quiet leak</div>
            <p data-reveal data-reveal-delay="60" className="ss-intro-lead">
              Most studios don&apos;t lose students in dramatic ways. They drift. A missed week
              becomes a missed month, the habit fades, and one day a student you loved teaching
              just isn&apos;t on the schedule anymore. You already paid to win them — in marketing,
              in intro offers, in your own time — and the recurring revenue they represented
              quietly walks out the door.
            </p>
            <p data-reveal data-reveal-delay="140" className="ss-intro-big">
              Keeping a student costs far less than winning a new one.{' '}
              <span className="ss-accent">Retention is the most valuable lever a studio has.</span>
            </p>
          </div>
        </section>

        {/* ================= THE SOLUTION ================= */}
        <section className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap">
            <div className="ss-fs-head">
              <div data-reveal className="ss-eyebrow2">What Sssion is</div>
              <h2 data-reveal data-reveal-delay="60" className="ss-h2" style={{ marginBottom: 22 }}>
                Your studio&apos;s community, carried between classes.
              </h2>
              <p data-reveal data-reveal-delay="120" className="ss-fs-lead">
                A private Sssion Space where your students connect, share progress, and stay
                motivated in the days between sessions.{' '}
                <span style={{ color: '#fff', fontWeight: 600 }}>
                  It&apos;s not here to move your studio online — it&apos;s here to keep your
                  students coming back to it.
                </span>
              </p>
            </div>
            <div className="ss-fs-cards">
              {SOLUTION_POINTS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="ss-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= THE CALCULATOR ================= */}
        <section className="ss-section" style={{ background: '#1A1A2E' }} id="calculator">
          <div className="ss-wrap">
            <div className="ss-calc-head">
              <div data-reveal className="ss-eyebrow2">Run your numbers</div>
              <h2 data-reveal data-reveal-delay="60" className="ss-h2" style={{ marginBottom: 18 }}>
                What is student churn <span className="ss-accent">costing</span> your studio?
              </h2>
              <p data-reveal data-reveal-delay="120" className="ss-fs-lead">
                You spend real time and money getting students through the door. Keeping them is
                cheaper — and worth more — than replacing them. See what a community that keeps
                students engaged between classes could be worth to your studio.
              </p>
            </div>
            <div data-reveal data-reveal-delay="160">
              <StudioRoiCalculator />
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap">
            <div className="ss-fs-head">
              <div data-reveal className="ss-eyebrow2">How it works</div>
              <h2 data-reveal data-reveal-delay="60" className="ss-h2" style={{ marginBottom: 22 }}>
                Simple on purpose.
              </h2>
              <p data-reveal data-reveal-delay="120" className="ss-fs-lead">
                No new software to master, no online business to run. A community hub for the
                studio you already have.
              </p>
            </div>
            <div className="ss-fs-cards">
              {HOW_IT_WORKS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="ss-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOUNDING STUDIOS CTA ================= */}
        <section className="ss-closing">
          {/* No dedicated CTA image was provided; reusing the hero shot (same pattern as /founding). */}
          <div className="ss-closing-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ss-img" src="/redesign/ss-fp-studio.webp" alt="" aria-hidden="true" />
          </div>
          <div className="ss-closing-scrim" />
          <div className="ss-grain" />
          <div className="ss-closing-inner">
            <div data-reveal className="ss-eyebrow2" style={{ marginBottom: 26 }}>Early days, honestly</div>
            <h2 data-reveal data-reveal-delay="80" className="ss-closing-h">
              We&apos;re building this with a small group of{' '}
              <span className="ss-accent">founding studios.</span>
            </h2>
            <p data-reveal data-reveal-delay="160" className="ss-closing-sub">
              The studio side of Sssion is in early beta — we&apos;re not selling you a finished
              product. We&apos;re inviting a handful of studio owners to shape it with us, and
              to measure what retention it actually earns.
            </p>
            <a data-reveal data-reveal-delay="240" href={STUDIO_MAILTO} className="ss-btn-primary" style={{ padding: '18px 40px', fontSize: 'clamp(16px,2vw,19px)' }}>
              Talk to us about your studio <span>→</span>
            </a>
            <p data-reveal data-reveal-delay="320" className="ss-closing-note">
              A conversation, not a sales pitch. We reply personally.
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
              <a href="/founding" className="ss-footer-link">Founding Studios</a>
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
