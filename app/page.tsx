import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import HomeInteractions from './HomeInteractions'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
})

const APP_STORE = 'https://apps.apple.com/us/app/sssion/id6763607808'

const css = `
@keyframes ss-kb{0%{transform:scale(1.04) translate(0,0)}100%{transform:scale(1.18) translate(-2%,-3%)}}
@keyframes ss-grain{0%{transform:translate(0,0)}20%{transform:translate(-4%,3%)}40%{transform:translate(3%,-4%)}60%{transform:translate(-3%,-2%)}80%{transform:translate(4%,2%)}100%{transform:translate(0,0)}}
@keyframes ss-scroll{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(7px);opacity:1}}
@keyframes ss-float1{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes ss-float2{0%,100%{transform:translateY(0)}50%{transform:translateY(15px)}}

.ss-home{position:relative;width:100%;overflow-x:hidden;background:#1A1A2E;color:#fff;font-family:var(--font-hanken),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ss-home *{box-sizing:border-box}
.ss-display{font-family:var(--font-bricolage),system-ui,sans-serif}
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
.ss-hero-media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.ss-hero-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,rgba(26,26,46,.62) 0%,rgba(26,26,46,.1) 24%,rgba(26,26,46,.12) 48%,rgba(26,26,46,.82) 80%,#1A1A2E 100%)}
.ss-hero-inner{position:relative;z-index:10;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(72px,11vw,120px)}
.ss-hero-copy{max-width:680px}
.ss-eyebrow{font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.34em;text-transform:uppercase;color:#D89AA3;margin-bottom:clamp(16px,2.4vw,22px)}
.ss-h1{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(54px,11vw,128px);line-height:.9;letter-spacing:-.035em;margin:0 0 clamp(18px,2.6vw,26px);text-wrap:balance}
.ss-hero-sub{font-size:clamp(17px,2.3vw,22px);line-height:1.5;color:#D3D3DE;margin:0 0 clamp(28px,3.6vw,38px);max-width:520px}
.ss-cta-row{display:flex;flex-wrap:wrap;gap:13px;margin-bottom:clamp(22px,3vw,28px)}
.ss-btn-primary{padding:16px 30px;border-radius:14px;background:linear-gradient(135deg,#C98693,#B76E79);color:#1A1A2E;font-weight:700;font-size:clamp(15px,1.9vw,17px);box-shadow:0 12px 30px -8px rgba(183,110,121,.6);transition:transform .25s ease,box-shadow .25s ease}
.ss-btn-primary:hover{transform:translateY(-2px);box-shadow:0 18px 40px -8px rgba(183,110,121,.75)}
.ss-btn-glass{padding:16px 30px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.24);color:#fff;font-weight:600;font-size:clamp(15px,1.9vw,17px);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:background .25s ease}
.ss-btn-glass:hover{background:rgba(255,255,255,.15)}
.ss-appstore{display:inline-flex;align-items:center;gap:11px;padding:11px 18px;border-radius:13px;background:#000;border:1px solid rgba(255,255,255,.18);transition:border-color .25s ease}
.ss-appstore:hover{border-color:rgba(255,255,255,.4)}
.ss-appstore .l1{font-size:9.5px;color:#c9c9d6;letter-spacing:.05em}
.ss-appstore .l2{font-size:16px;color:#fff;font-weight:600}
.ss-scrollcue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:7px;pointer-events:none}
.ss-scrollcue span{font-weight:600;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#9999AA}

/* Sections shared */
.ss-section{position:relative;padding:clamp(80px,13vw,168px) clamp(20px,5vw,64px)}
.ss-wrap{max-width:1180px;margin:0 auto}
.ss-eyebrow2{font-weight:600;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:#B76E79;margin-bottom:22px}
.ss-h2{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(32px,5.4vw,58px);line-height:1;letter-spacing:-.03em;margin:0 0 26px;text-wrap:balance}
.ss-body{font-size:clamp(16px,2vw,19px);line-height:1.65;margin:0}
.ss-arrowlink{display:inline-flex;align-items:center;gap:10px;font-size:clamp(16px,2vw,18px);font-weight:700;color:#D89AA3;transition:gap .25s ease,color .25s ease}
.ss-arrowlink:hover{gap:16px;color:#E8B4BC}

/* Why */
.ss-why-wrap{display:flex;flex-wrap:wrap;gap:clamp(40px,6vw,80px);align-items:center}
.ss-col{flex:1 1 420px;min-width:280px}
.ss-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.ss-chip{padding:9px 16px;border:1px solid rgba(183,110,121,.4);border-radius:999px;font-size:13px;font-weight:600;color:#D89AA3}
.ss-why-media{position:relative;flex:1 1 360px;min-width:280px;aspect-ratio:4/5;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -24px rgba(0,0,0,.6)}

/* Members */
.ss-members-wrap{display:flex;flex-wrap:wrap-reverse;gap:clamp(40px,6vw,80px);align-items:center}
.ss-collage{flex:1 1 380px;min-width:280px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ss-collage-col{display:flex;flex-direction:column;gap:16px}
.ss-collage-col--a{animation:ss-float1 8s ease-in-out infinite}
.ss-collage-col--b{margin-top:34px;animation:ss-float2 8s ease-in-out infinite}
.ss-collage-item{border-radius:18px;overflow:hidden;box-shadow:0 20px 50px -18px rgba(0,0,0,.55)}
.ss-ar-34{aspect-ratio:3/4}
.ss-ar-11{aspect-ratio:1/1}
.ss-members-text{flex:1 1 380px;min-width:280px}

/* Creators */
.ss-creators-head{max-width:640px;margin-bottom:clamp(40px,6vw,64px)}
.ss-feature-band{position:relative;width:100%;aspect-ratio:16/7;min-height:220px;border-radius:24px;overflow:hidden;margin-bottom:clamp(20px,3vw,28px);box-shadow:0 34px 80px -30px rgba(0,0,0,.65)}
.ss-feature-band-scrim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(26,26,46,.5),rgba(26,26,46,0) 55%)}
.ss-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(16px,2vw,22px);margin-bottom:clamp(40px,6vw,56px)}
.ss-card{padding:clamp(26px,3vw,34px);border-radius:20px;background:#2A2A3E;border:1px solid rgba(255,255,255,.06);transition:transform .3s ease,border-color .3s ease}
.ss-card:hover{transform:translateY(-6px);border-color:rgba(183,110,121,.4)}
.ss-card-num{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:15px;color:#B76E79;margin-bottom:20px}
.ss-card-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(21px,2.6vw,26px);line-height:1.1;letter-spacing:-.02em;margin:0 0 12px}
.ss-card-p{font-size:15.5px;line-height:1.6;color:#9999AA;margin:0}

/* Closing */
.ss-closing{position:relative;min-height:82svh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:clamp(80px,12vw,140px) clamp(20px,5vw,64px)}
.ss-closing-bg{position:absolute;inset:0;z-index:0;animation:ss-kb 26s ease-in-out infinite alternate}
.ss-closing-scrim{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(180deg,#1A1A2E 0%,rgba(26,26,46,.7) 30%,rgba(26,26,46,.72) 70%,#1A1A2E 100%)}
.ss-closing-inner{position:relative;z-index:10;text-align:center;max-width:900px}
.ss-closing-h{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(38px,8vw,88px);line-height:1;letter-spacing:-.035em;margin:0 0 clamp(32px,4vw,44px);text-wrap:balance}
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
.ss-appstore--sm .l1{font-size:9px}
.ss-appstore--sm .l2{font-size:15px}
`

const AppleLogo = () => (
  <svg width="19" height="19" viewBox="0 0 384 512" fill="#fff" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

export default function Home() {
  return (
    <div className={`${bricolage.variable} ${hanken.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ss-home" id="top">
        {/* ================= HEADER ================= */}
        <header id="ss-header" className="ss-header">
          <a href="#top" className="ss-logo">sssion</a>
          <nav className="ss-nav">
            <a href="/discover" className="ss-navlink">Discover</a>
            <a href="#creators" className="ss-navlink">For creators</a>
            <a
              href={APP_STORE}
              target="_blank"
              rel="noopener"
              className="ss-navpill"
            >
              Get the app
            </a>
          </nav>
        </header>

        {/* ================= HERO ================= */}
        <section className="ss-hero">
          <div id="ss-hero-media" className="ss-hero-media">
            <video autoPlay muted loop playsInline preload="auto">
              <source src="/redesign/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div id="ss-hero-scrim" className="ss-hero-scrim" />
          <div className="ss-grain" />

          <div style={{ flex: 1 }} />
          <div className="ss-hero-inner">
            <div className="ss-hero-copy">
              <div data-reveal className="ss-eyebrow">Private space platform</div>
              <h1 data-reveal data-reveal-delay="80" className="ss-h1">
                Own your<br />
                <span className="ss-accent">movement.</span>
              </h1>
              <p data-reveal data-reveal-delay="180" className="ss-hero-sub">
                A private space platform for movement creators and the people who move with them.
              </p>
              <div data-reveal data-reveal-delay="280" className="ss-cta-row">
                <a href="/join" className="ss-btn-primary">I&apos;m a Creator</a>
                <a href={APP_STORE} target="_blank" rel="noopener" className="ss-btn-glass">
                  I&apos;m a Member
                </a>
              </div>
              <a
                data-reveal
                data-reveal-delay="360"
                href={APP_STORE}
                target="_blank"
                rel="noopener"
                className="ss-appstore"
              >
                <AppleLogo />
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                  <span className="l1">Download on the</span>
                  <span className="l2">App Store</span>
                </span>
              </a>
            </div>
          </div>

          <div className="ss-scrollcue">
            <span>Scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9999AA"
              strokeWidth="2"
              style={{ animation: 'ss-scroll 1.8s ease-in-out infinite' }}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>

        {/* ================= WHY SSSION EXISTS ================= */}
        <section id="why" className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-wrap ss-why-wrap">
            <div className="ss-col">
              <div data-reveal className="ss-eyebrow2">Why Sssion exists</div>
              <h2 data-reveal data-reveal-delay="80" className="ss-h2">
                Built because movement deserves better.
              </h2>
              <p data-reveal data-reveal-delay="160" className="ss-body" style={{ color: '#B9B9C6', maxWidth: 520 }}>
                Pole, floor work, heels, contemporary, flexibility, yoga and flow — the disciplines
                mainstream platforms shadowban, demonetize, and bury. Sssion is a home built for this
                art, on creators&apos; terms.
              </p>
              <div data-reveal data-reveal-delay="240" className="ss-chips">
                <span className="ss-chip">No algorithm</span>
                <span className="ss-chip">No Shadowbans</span>
                <span className="ss-chip">No cuts</span>
              </div>
            </div>
            <div data-reveal data-reveal-delay="120" className="ss-why-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-home-why.webp" alt="A Sssion creator mid-movement" />
            </div>
          </div>
        </section>

        {/* ================= FOR MEMBERS ================= */}
        <section id="members" className="ss-section" style={{ background: '#2A2A3E' }}>
          <div className="ss-wrap ss-members-wrap">
            <div data-reveal className="ss-collage">
              <div className="ss-collage-col ss-collage-col--a">
                <div className="ss-collage-item ss-ar-34">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ss-img" src="/redesign/ss-home-mem1.webp" alt="A movement creator" />
                </div>
                <div className="ss-collage-item ss-ar-11">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ss-img" src="/redesign/ss-home-mem2.webp" alt="A training session" />
                </div>
              </div>
              <div className="ss-collage-col ss-collage-col--b">
                <div className="ss-collage-item ss-ar-11">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ss-img" src="/redesign/ss-home-mem3.webp" alt="The Sssion community" />
                </div>
                <div className="ss-collage-item ss-ar-34">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="ss-img" src="/redesign/ss-home-mem4.webp" alt="A movement creator" />
                </div>
              </div>
            </div>
            <div className="ss-members-text">
              <div data-reveal className="ss-eyebrow2">For members</div>
              <h2 data-reveal data-reveal-delay="80" className="ss-h2">
                Find your people. Move together.
              </h2>
              <p data-reveal data-reveal-delay="160" className="ss-body" style={{ color: '#C4C4D0', maxWidth: 500, marginBottom: 32 }}>
                Discover creators whose style moves you, train on-demand at your own pace, join live
                sessions, and become part of a real community — not a feed.
              </p>
              <a data-reveal data-reveal-delay="220" href="/discover" className="ss-arrowlink">
                Explore spaces <span style={{ fontSize: '1.1em' }}>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= FOR CREATORS ================= */}
        <section id="creators" className="ss-section" style={{ background: '#1A1A2E' }}>
          <div className="ss-wrap">
            <div className="ss-creators-head">
              <div data-reveal className="ss-eyebrow2">For creators</div>
              <h2 data-reveal data-reveal-delay="80" className="ss-h2" style={{ fontSize: 'clamp(32px,5.6vw,60px)', marginBottom: 20 }}>
                Your space. Your community. Your terms.
              </h2>
              <p data-reveal data-reveal-delay="160" className="ss-body" style={{ color: '#B9B9C6', lineHeight: 1.6 }}>
                Build a home for your art — with the infrastructure to run it and none of the
                middlemen taking a cut.
              </p>
            </div>

            <div data-reveal className="ss-feature-band">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ss-img" src="/redesign/ss-home-cr-feature.webp" alt="The Sssion creator space" />
              <div className="ss-feature-band-scrim" />
            </div>

            <div className="ss-cards">
              <div data-reveal data-reveal-delay="60" className="ss-card">
                <div className="ss-card-num">01</div>
                <h3 className="ss-card-h">Your private space</h3>
                <p className="ss-card-p">
                  Upload your sessions, build your library, and make the space unmistakably yours.
                </p>
              </div>
              <div data-reveal data-reveal-delay="140" className="ss-card">
                <div className="ss-card-num">02</div>
                <h3 className="ss-card-h">Your community</h3>
                <p className="ss-card-p">
                  Posts, progress, and real relationships — the people who move with you, in one place.
                </p>
              </div>
              <div data-reveal data-reveal-delay="220" className="ss-card">
                <div className="ss-card-num">03</div>
                <h3 className="ss-card-h">Your business</h3>
                <p className="ss-card-p">
                  Keep 100%. No cuts, no commissions — what you earn is yours.
                </p>
              </div>
            </div>

            <div data-reveal style={{ textAlign: 'center' }}>
              <a href="/join" className="ss-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, padding: '17px 36px', fontSize: 'clamp(16px,2vw,18px)' }}>
                Start your space <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= CLOSING ================= */}
        <section className="ss-closing">
          {/* No dedicated closing image was provided in the design; reusing the "why" movement shot. */}
          <div className="ss-closing-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ss-img" src="/redesign/ss-home-why.webp" alt="" aria-hidden="true" />
          </div>
          <div className="ss-closing-scrim" />
          <div className="ss-grain" />
          <div className="ss-closing-inner">
            <h2 data-reveal className="ss-closing-h">
              Your body.<br />Your art.<br />
              <span className="ss-accent">Your space.</span>
            </h2>
            <div data-reveal data-reveal-delay="140" className="ss-closing-cta">
              <a href="/join" className="ss-btn-primary" style={{ padding: '16px 32px' }}>I&apos;m a Creator</a>
              <a href={APP_STORE} target="_blank" rel="noopener" className="ss-btn-glass" style={{ padding: '16px 32px', background: 'rgba(255,255,255,.09)', borderColor: 'rgba(255,255,255,.26)' }}>
                I&apos;m a Member
              </a>
            </div>
          </div>
        </section>
      </div>

      <HomeInteractions />

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* 6. FOOTER (restyled to match design; all existing links preserved) */}
      <footer className="ss-footer">
        <div className="ss-footer-top">
          <div className="ss-footer-brand">
            <div className="ss-footer-logo">sssion</div>
            <p className="ss-footer-tagline">Own your movement.</p>
            <a href={APP_STORE} target="_blank" rel="noopener" className="ss-appstore ss-appstore--sm">
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
              <a href="/polecon" className="ss-footer-link">PoleCon Planner</a>
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
