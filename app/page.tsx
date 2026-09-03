import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import OpenDoorCta from '@/components/OpenDoorCta'
import VideoWell from '@/components/marketing/VideoWell'
import IvoryInteractions from '@/components/marketing/IvoryInteractions'
import {
  MARKETING_CSS,
  marketingFontVars,
  MarketingNav,
  MarketingFooter,
  AppleLogo,
  APP_STORE,
} from '@/components/marketing/MarketingChrome'

// Page-specific ivory styles layered on top of the shared MARKETING_CSS.
const css = `
.mk-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#000}
.mk-hero-media{position:absolute;inset:-4% 0;z-index:0;will-change:transform}
.mk-hero-media video,.mk-hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.04) 28%,rgba(0,0,0,.16) 54%,rgba(0,0,0,.8) 100%)}
.mk-hero-inner{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(60px,10vw,110px)}
.mk-hero-eyebrow{font-weight:600;font-size:clamp(11px,1.4vw,13px);letter-spacing:.3em;text-transform:uppercase;color:rgba(247,244,239,.72);margin:0 0 clamp(16px,2.4vw,22px)}
.mk-hero-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(58px,13vw,150px);line-height:.88;letter-spacing:-.03em;margin:0 0 clamp(18px,2.6vw,24px);color:#F7F4EF;text-wrap:balance}
.mk-hero-sub{font-size:clamp(17px,2.2vw,22px);line-height:1.5;color:rgba(247,244,239,.85);margin:0 0 clamp(26px,3.4vw,34px);max-width:520px}
.mk-hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:22px}
.mk-btn-cream{background:#F7F4EF;color:#1D1B18;border:1px solid #F7F4EF}
.mk-btn-cream:hover{background:#fff;transform:translateY(-1px)}
.mk-btn-ghost{background:transparent;color:#F7F4EF;border:1px solid rgba(247,244,239,.55)}
.mk-btn-ghost:hover{background:rgba(247,244,239,.14)}
.mk-appstore--hero{border:1px solid rgba(247,244,239,.28)}

.mk-two{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(36px,6vw,80px);align-items:center}
@media(max-width:860px){.mk-two{grid-template-columns:1fr;gap:36px}}
.mk-two--rev .mk-two-media{order:-1}
@media(min-width:861px){.mk-two--rev .mk-two-media{order:0}}
.mk-chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}

.mk-mem-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mk-mem-grid>*:nth-child(2){margin-top:28px}
.mk-mem-grid>*:nth-child(3){margin-top:-28px}

.mk-band{margin:clamp(28px,4vw,40px) 0}
.mk-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.mk-card{background:#FFFFFF;border:1px solid #E5E0D6;border-radius:18px;padding:clamp(24px,3vw,32px);transition:transform .3s ease,box-shadow .3s ease}
.mk-card:hover{transform:translateY(-4px);box-shadow:0 22px 50px -30px rgba(29,27,24,.35)}
.mk-card-num{font-family:var(--font-fraunces),Georgia,serif;font-size:16px;color:#9E5C68;margin-bottom:16px}
.mk-card-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(20px,2.5vw,25px);letter-spacing:-.01em;margin:0 0 10px}
.mk-card-p{font-size:15px;line-height:1.6;color:#8D877D;margin:0}

/* Movement wall — edge-to-edge row of vertical clips in black wells */
.mk-wall-sec{padding:clamp(64px,10vw,120px) 0}
.mk-wall-head{max-width:1180px;margin:0 auto clamp(28px,4vw,40px);padding:0 clamp(20px,5vw,64px)}
.mk-wall{display:flex;gap:14px;overflow-x:auto;padding:6px clamp(20px,5vw,64px);scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
.mk-wall::-webkit-scrollbar{display:none}
.mk-wall{scrollbar-width:none}
.mk-wall-item{flex:0 0 auto;width:clamp(150px,44vw,216px);scroll-snap-align:start}

/* Closing full-bleed */
.mk-closing{position:relative;min-height:78svh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000;padding:clamp(72px,11vw,130px) clamp(20px,5vw,64px)}
.mk-closing-media{position:absolute;inset:0;z-index:0}
.mk-closing-media video,.mk-closing-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-closing-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35) 45%,rgba(0,0,0,.7))}
.mk-closing-inner{position:relative;z-index:2;text-align:center;max-width:900px}
.mk-closing-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(40px,9vw,104px);line-height:.98;letter-spacing:-.03em;margin:0 0 clamp(28px,4vw,40px);color:#F7F4EF;text-wrap:balance}
.mk-closing-cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
`

export default function Home() {
  return (
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />

      <div className="mk" id="top">
        <MarketingNav />

        {/* ================= HERO — full-bleed real footage ================= */}
        <section className="mk-hero">
          <div id="ss-hero-media" className="mk-hero-media">
            {/* Real hero footage; reduce-motion shows the poster frame. */}
            <video autoPlay muted loop playsInline preload="auto" poster="/redesign/ss-home-why.webp">
              <source src="/redesign/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="mk-hero-scrim" />
          <div className="mk-hero-inner">
            <div data-reveal className="mk-hero-eyebrow">Private space platform</div>
            <h1 data-reveal data-reveal-delay="80" className="mk-hero-h1">
              Own your<br />movement.
            </h1>
            <p data-reveal data-reveal-delay="180" className="mk-hero-sub">
              A private space platform for movement creators and the people who move with them.
            </p>
            <div data-reveal data-reveal-delay="280" className="mk-hero-ctas">
              <a href="#waitlist" className="mk-btn mk-btn-cream">I&apos;m a Creator</a>
              <a href="/student-signup" className="mk-btn mk-btn-ghost">I&apos;m a Member</a>
            </div>
            <a data-reveal data-reveal-delay="360" href={APP_STORE} target="_blank" rel="noopener" className="mk-appstore mk-appstore--hero">
              <AppleLogo />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                <span className="l1">Download on the</span>
                <span className="l2">App Store</span>
              </span>
            </a>
          </div>
        </section>

        {/* ================= WHY SSSION EXISTS — text + vertical clip ================= */}
        <section id="why" className="mk-section">
          <div className="mk-wrap mk-two">
            <div>
              <div data-reveal className="mk-eyebrow">Why Sssion exists</div>
              <h2 data-reveal data-reveal-delay="80" className="mk-h2">
                Built because movement deserves better.
              </h2>
              <p data-reveal data-reveal-delay="160" className="mk-body" style={{ maxWidth: 520 }}>
                Pole, floor work, heels, contemporary, flexibility, yoga and flow — the disciplines
                mainstream platforms shadowban, demonetize, and bury. Sssion is a home built for this
                art, on creators&apos; terms.
              </p>
              <div data-reveal data-reveal-delay="240" className="mk-chips">
                <span className="mk-tag">No algorithm</span>
                <span className="mk-tag">No shadowbans</span>
                <span className="mk-tag">No cuts</span>
              </div>
            </div>
            <div data-reveal data-reveal-delay="120" className="mk-two-media">
              <VideoWell poster="/redesign/ss-home-why.webp" ratio="4 / 5" />
            </div>
          </div>
        </section>

        <div className="mk-wrap"><hr className="mk-hairline" /></div>

        {/* ================= FOR MEMBERS — well collage ================= */}
        <section id="members" className="mk-section">
          <div className="mk-wrap mk-two mk-two--rev">
            <div>
              <div data-reveal className="mk-eyebrow">For members</div>
              <h2 data-reveal data-reveal-delay="80" className="mk-h2">
                Find your people. Move together.
              </h2>
              <p data-reveal data-reveal-delay="160" className="mk-body" style={{ maxWidth: 500, marginBottom: 28 }}>
                Discover creators whose style moves you, train on-demand at your own pace, join live
                sessions, and become part of a real community — not a feed.
              </p>
              <a data-reveal data-reveal-delay="220" href="/discover" className="mk-arrowlink">
                Explore spaces <span aria-hidden>→</span>
              </a>
            </div>
            <div data-reveal className="mk-two-media mk-mem-grid">
              <VideoWell poster="/redesign/ss-home-mem1.webp" ratio="3 / 4" />
              <VideoWell poster="/redesign/ss-home-mem2.webp" ratio="3 / 4" />
              <VideoWell poster="/redesign/ss-home-mem3.webp" ratio="3 / 4" />
              <VideoWell poster="/redesign/ss-home-mem4.webp" ratio="3 / 4" />
            </div>
          </div>
        </section>

        {/* ================= FOR CREATORS — feature band + cards ================= */}
        <section id="creators" className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6', borderBottom: '1px solid #E5E0D6' }}>
          <div className="mk-wrap">
            <div style={{ maxWidth: 640 }}>
              <div data-reveal className="mk-eyebrow">For creators</div>
              <h2 data-reveal data-reveal-delay="80" className="mk-h2">
                Your space. Your community. Your terms.
              </h2>
              <p data-reveal data-reveal-delay="160" className="mk-body" style={{ maxWidth: 560 }}>
                Build a home for your art — with the infrastructure to run it and none of the
                middlemen taking a cut.
              </p>
            </div>

            <div data-reveal className="mk-band">
              <VideoWell poster="/redesign/ss-home-cr-feature.webp" ratio="16 / 7" />
            </div>

            <div className="mk-cards">
              <div data-reveal data-reveal-delay="60" className="mk-card">
                <div className="mk-card-num">01</div>
                <h3 className="mk-card-h">Your private space</h3>
                <p className="mk-card-p">Upload your sessions, build your library, and make the space unmistakably yours.</p>
              </div>
              <div data-reveal data-reveal-delay="140" className="mk-card">
                <div className="mk-card-num">02</div>
                <h3 className="mk-card-h">Your community</h3>
                <p className="mk-card-p">Posts, progress, and real relationships — the people who move with you, in one place.</p>
              </div>
              <div data-reveal data-reveal-delay="220" className="mk-card">
                <div className="mk-card-num">03</div>
                <h3 className="mk-card-h">Your business</h3>
                <p className="mk-card-p">Keep 100%. No cuts, no commissions — what you earn is yours.</p>
              </div>
            </div>

            <div data-reveal style={{ marginTop: 'clamp(28px,4vw,40px)' }}>
              <a href="#waitlist" className="mk-btn mk-btn-ink">Start your space <span aria-hidden>→</span></a>
            </div>
          </div>
        </section>

        {/* ================= MOVEMENT WALL — the energy of Discover ================= */}
        {/* TODO(footage): these vertical wells are real member stills / placeholders
            standing in for live creator clips. Swap each to a short muted vertical
            loop (with permission) as footage is licensed. No stock footage. */}
        <section className="mk-wall-sec">
          <div className="mk-wall-head">
            <div data-reveal className="mk-eyebrow">In motion</div>
            <h2 data-reveal data-reveal-delay="80" className="mk-h2" style={{ marginBottom: 12 }}>
              The energy of Discover.
            </h2>
            <p data-reveal data-reveal-delay="160" className="mk-body mk-body-2" style={{ maxWidth: 520 }}>
              Real moments from real creators — the feeling of the platform, brought to the page.
            </p>
          </div>
          <div data-reveal className="mk-wall">
            <div className="mk-wall-item"><VideoWell poster="/redesign/ss-home-mem1.webp" ratio="9 / 16" /></div>
            <div className="mk-wall-item"><VideoWell poster="/redesign/ss-home-mem2.webp" ratio="9 / 16" /></div>
            <div className="mk-wall-item"><VideoWell poster="/redesign/ss-home-mem3.webp" ratio="9 / 16" /></div>
            <div className="mk-wall-item"><VideoWell poster="/redesign/ss-home-mem4.webp" ratio="9 / 16" /></div>
            <div className="mk-wall-item"><VideoWell ratio="9 / 16" label="Clip coming" /></div>
            <div className="mk-wall-item"><VideoWell ratio="9 / 16" label="Clip coming" /></div>
          </div>
        </section>

        {/* ================= OPEN DOOR CTA (replaces the creator waitlist) ================= */}
        <OpenDoorCta />

        {/* ================= CLOSING — full-bleed footage ================= */}
        <section className="mk-closing">
          <div className="mk-closing-media">
            {/* Return of the hero footage; reduce-motion shows the poster. */}
            <video autoPlay muted loop playsInline preload="none" poster="/redesign/ss-home-why.webp" aria-hidden="true">
              <source src="/redesign/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="mk-closing-scrim" />
          <div className="mk-closing-inner">
            <h2 data-reveal className="mk-closing-h">Your body. Your art. Your space.</h2>
            <div data-reveal data-reveal-delay="140" className="mk-closing-cta">
              <a href="#waitlist" className="mk-btn mk-btn-cream">I&apos;m a Creator</a>
              <a href="/student-signup" className="mk-btn mk-btn-ghost">I&apos;m a Member</a>
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
