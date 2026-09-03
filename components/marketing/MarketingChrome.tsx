import { Fraunces, Hanken_Grotesk } from 'next/font/google'

// Shared ivory-editorial chrome for the marketing pages (homepage, /founding,
// /features, blog). Fraunces = display; Hanken = body/UI.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
})

export const marketingFontVars = `${fraunces.variable} ${hanken.variable}`

export const APP_STORE = 'https://apps.apple.com/us/app/sssion/id6763607808'

// ── Shared ivory system CSS ──────────────────────────────────────────────────
// Palette: page #F7F4EF · surface #FFFFFF · hairline #E5E0D6 · ink #1D1B18 ·
// secondary #8D877D · rose (detail only) #9E5C68 · video wells true black.
export const MARKETING_CSS = `
.mk{position:relative;width:100%;overflow-x:hidden;background:#F7F4EF;color:#1D1B18;font-family:var(--font-hanken),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.mk *{box-sizing:border-box}
.mk-display{font-family:var(--font-fraunces),Georgia,serif}
.mk-accent{color:#9E5C68}
.mk-serif-i{font-family:var(--font-fraunces),Georgia,serif;font-style:italic}

/* Type scale */
.mk-eyebrow{font-weight:600;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#8D877D;margin:0 0 18px}
.mk-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(52px,11vw,132px);line-height:.92;letter-spacing:-.03em;margin:0 0 clamp(18px,2.6vw,26px);text-wrap:balance}
.mk-h2{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(34px,5.6vw,64px);line-height:1.0;letter-spacing:-.02em;margin:0 0 22px;text-wrap:balance}
.mk-body{font-size:clamp(16px,2vw,19px);line-height:1.65;color:#4A463F;margin:0}
.mk-body-2{color:#8D877D}

/* Buttons — ink primary, rose is detail only */
.mk-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:16px 30px;border-radius:13px;font-size:clamp(15px,1.9vw,17px);font-weight:600;font-family:inherit;cursor:pointer;transition:transform .2s ease,background .2s ease,color .2s ease,border-color .2s ease;text-decoration:none}
.mk-btn-ink{background:#1D1B18;color:#F7F4EF;border:1px solid #1D1B18}
.mk-btn-ink:hover{background:#3A3630;transform:translateY(-1px)}
.mk-btn-outline{background:transparent;color:#1D1B18;border:1px solid #1D1B18}
.mk-btn-outline:hover{background:#1D1B18;color:#F7F4EF}
.mk-arrowlink{display:inline-flex;align-items:center;gap:9px;font-size:clamp(15px,2vw,17px);font-weight:600;color:#9E5C68;text-decoration:none;border-bottom:1px solid #9E5C68;padding-bottom:2px;transition:gap .2s ease,color .2s ease,border-color .2s ease}
.mk-arrowlink:hover{gap:13px;color:#1D1B18;border-color:#1D1B18}

/* Sections */
.mk-section{position:relative;padding:clamp(72px,12vw,150px) clamp(20px,5vw,64px)}
.mk-wrap{max-width:1180px;margin:0 auto}
.mk-hairline{height:1px;background:#E5E0D6;border:0;margin:0}
.mk-tag{display:inline-flex;align-items:center;padding:8px 15px;border:1px solid #E5E0D6;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#1D1B18;background:#FFFFFF}

/* Header / nav */
.mk-header{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(14px,2.6vw,20px) clamp(20px,5vw,64px);transition:background .35s ease,backdrop-filter .35s ease,border-color .35s ease;border-bottom:1px solid transparent}
.mk-logo{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(21px,2.4vw,26px);letter-spacing:-.01em;color:#1D1B18;text-decoration:none}
.mk-nav{display:flex;align-items:center;gap:clamp(16px,2.4vw,30px)}
.mk-navlink{color:#5F5A52;font-size:14px;font-weight:500;text-decoration:none;display:none;transition:color .2s ease}
.mk-navlink:hover{color:#1D1B18}
@media(min-width:820px){.mk-navlink{display:inline-flex}}
.mk-navpill{display:inline-flex;align-items:center;padding:10px 18px;border-radius:999px;background:#1D1B18;color:#F7F4EF;font-size:13px;font-weight:600;text-decoration:none;transition:background .2s ease}
.mk-navpill:hover{background:#3A3630}

/* Video wells — video/imagery always sits in true black on the ivory page */
.mk-well{position:relative;overflow:hidden;background:#000;border-radius:20px;box-shadow:0 30px 70px -34px rgba(29,27,24,.4)}
.mk-well video,.mk-well img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.mk-well-scrim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.35) 100%)}
/* Placeholder well — dark, with a slow "coming soon" shimmer. Replace with real footage. */
.mk-well-ph{background:radial-gradient(120% 100% at 30% 20%,#26232A 0%,#141216 55%,#000 100%)}
.mk-well-ph::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(247,244,239,.07) 50%,transparent 70%);background-size:220% 100%;animation:mk-shimmer 3.4s linear infinite}
.mk-well-ph-label{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:10px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(247,244,239,.5)}
@keyframes mk-shimmer{0%{background-position:120% 0}100%{background-position:-120% 0}}

/* Footer */
.mk-footer{background:#FFFFFF;border-top:1px solid #E5E0D6;padding:clamp(52px,8vw,84px) clamp(20px,5vw,64px) clamp(32px,5vw,44px);color:#1D1B18}
.mk-footer-top{max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap;gap:40px;justify-content:space-between}
.mk-footer-brand{flex:1 1 260px;min-width:240px}
.mk-footer-logo{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:28px;margin-bottom:8px}
.mk-footer-tagline{font-family:var(--font-fraunces),Georgia,serif;font-style:italic;font-size:18px;color:#9E5C68;margin:0 0 22px}
.mk-footer-cols{display:flex;flex-wrap:wrap;gap:clamp(36px,6vw,72px)}
.mk-footer-col{display:flex;flex-direction:column;gap:13px}
.mk-footer-label{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#8D877D;margin-bottom:3px}
.mk-footer-link{color:#5F5A52;font-size:15px;font-weight:500;text-decoration:none;transition:color .2s ease}
.mk-footer-link:hover{color:#1D1B18}
.mk-footer-bottom{max-width:1180px;margin:44px auto 0;padding-top:22px;border-top:1px solid #E5E0D6;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;font-size:13px;color:#8D877D}
.mk-appstore{display:inline-flex;align-items:center;gap:10px;padding:11px 17px;border-radius:12px;background:#1D1B18;text-decoration:none;transition:background .2s ease}
.mk-appstore:hover{background:#3A3630}
.mk-appstore .l1{font-size:9px;color:#B9B3A8;letter-spacing:.05em}
.mk-appstore .l2{font-size:15px;color:#F7F4EF;font-weight:600}

@media(prefers-reduced-motion:reduce){.mk-well-ph::after{animation:none}}
`

export const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 384 512" fill="#F7F4EF" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

/** Ivory sticky marketing header. `pill` overrides the right-hand CTA. */
export function MarketingNav({
  pill = { label: 'Get the app', href: APP_STORE, external: true },
}: {
  pill?: { label: string; href: string; external?: boolean }
}) {
  return (
    <header id="ss-header" className="mk-header">
      <a href="/" className="mk-logo">sssion</a>
      <nav className="mk-nav">
        <a href="/discover" className="mk-navlink">Discover</a>
        <a href="/features" className="mk-navlink">Features</a>
        <a href="/studios" className="mk-navlink">For studios</a>
        <a href="/blog" className="mk-navlink">Blog</a>
        <a
          href={pill.href}
          className="mk-navpill"
          {...(pill.external ? { target: '_blank', rel: 'noopener' } : {})}
        >
          {pill.label}
        </a>
      </nav>
    </header>
  )
}

/** Ivory marketing footer — all existing links preserved. */
export function MarketingFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-footer-top">
        <div className="mk-footer-brand">
          <div className="mk-footer-logo">sssion</div>
          <p className="mk-footer-tagline">Own your movement.</p>
          <a href={APP_STORE} target="_blank" rel="noopener" className="mk-appstore">
            <AppleLogo />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span className="l1">Download on the</span>
              <span className="l2">App Store</span>
            </span>
          </a>
        </div>
        <div className="mk-footer-cols">
          <div className="mk-footer-col">
            <span className="mk-footer-label">Platform</span>
            <a href="/studios" className="mk-footer-link">For Studios</a>
            <a href="/features" className="mk-footer-link">Features &amp; Pricing</a>
            <a href="/discover" className="mk-footer-link">Discover Creators</a>
            <a href="/blog" className="mk-footer-link">Blog</a>
          </div>
          <div className="mk-footer-col">
            <span className="mk-footer-label">Account</span>
            <a href="/signin" className="mk-footer-link">Creator Sign In</a>
            <a href="/student-signin" className="mk-footer-link">Student Sign In</a>
          </div>
          <div className="mk-footer-col">
            <span className="mk-footer-label">Legal</span>
            <a href="/privacy" className="mk-footer-link">Privacy</a>
            <a href="/terms" className="mk-footer-link">Terms</a>
            <a href="/content-policy" className="mk-footer-link">Content Policy</a>
            <a href="/dmca" className="mk-footer-link">DMCA</a>
          </div>
        </div>
      </div>
      <div className="mk-footer-bottom">
        <span>&copy; 2026 Sssion. Your body. Your art. Your space.</span>
        <span>Made for movement.</span>
      </div>
    </footer>
  )
}
