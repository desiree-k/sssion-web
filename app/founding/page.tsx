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

// Founding Studios are full — the founding CTAs funnel to the homepage waitlist.
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
@keyframes mk-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes mk-pulse{0%,100%{box-shadow:0 0 0 0 rgba(158,92,104,.5)}50%{box-shadow:0 0 0 6px rgba(158,92,104,0)}}

.mk-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#000}
.mk-hero-media{position:absolute;inset:-4% 0;z-index:0;will-change:transform}
.mk-hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,.06) 30%,rgba(0,0,0,.2) 56%,rgba(0,0,0,.8) 100%)}
.mk-hero-inner{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(60px,10vw,110px)}
.mk-hero-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(58px,13vw,150px);line-height:.88;letter-spacing:-.03em;margin:0 0 clamp(16px,2.4vw,22px);color:#F7F4EF;text-wrap:balance}
.mk-hero-sub{font-size:clamp(17px,2.2vw,22px);line-height:1.5;color:rgba(247,244,239,.85);margin:0 0 clamp(24px,3.4vw,32px);max-width:520px}
.mk-btn-cream{background:#F7F4EF;color:#1D1B18;border:1px solid #F7F4EF}
.mk-btn-cream:hover{background:#fff;transform:translateY(-1px)}
.mk-badge{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:600;letter-spacing:.02em;color:rgba(247,244,239,.85);border:1px solid rgba(247,244,239,.28);border-radius:999px;padding:8px 15px;margin:0 0 22px;background:rgba(0,0,0,.25)}
.mk-badge-dot{width:7px;height:7px;border-radius:50%;background:#9E5C68;animation:mk-pulse 2.4s ease-in-out infinite}
.mk-fs-banner{position:absolute;top:clamp(78px,12vw,98px);left:50%;transform:translateX(-50%);z-index:3;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;width:max-content;max-width:calc(100% - 32px);padding:10px 12px 10px 18px;border-radius:999px;background:rgba(247,244,239,.92);border:1px solid #E5E0D6;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 14px 40px -18px rgba(0,0,0,.4);text-align:center}
.mk-fs-banner-dot{width:8px;height:8px;border-radius:50%;background:#9E5C68;flex:none}
.mk-fs-banner-text{font-size:clamp(12px,1.6vw,14px);color:#5F5A52}
.mk-fs-banner-text strong{color:#1D1B18;font-weight:600}
.mk-fs-banner-cta{display:inline-flex;align-items:center;padding:8px 15px;border-radius:999px;background:#1D1B18;color:#F7F4EF;font-weight:600;font-size:13px;white-space:nowrap;text-decoration:none}

.mk-intro{max-width:900px;margin:0 auto}
.mk-intro-lead{font-size:clamp(15px,1.9vw,18px);line-height:1.7;color:#8D877D;margin:0 0 clamp(22px,3vw,30px);max-width:640px}
.mk-intro-big{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(26px,4.4vw,46px);line-height:1.18;letter-spacing:-.02em;margin:0;text-wrap:balance}

.mk-fs-head{max-width:640px;margin-bottom:clamp(36px,5vw,52px)}
.mk-fs-lead{font-size:clamp(16px,2vw,19px);line-height:1.6;color:#8D877D;margin:0}
.mk-fs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:#E5E0D6;border:1px solid #E5E0D6;border-radius:20px;overflow:hidden}
.mk-fs-card{background:#FFFFFF;padding:clamp(26px,3vw,36px)}
.mk-fs-card .num{font-family:var(--font-fraunces),Georgia,serif;font-size:15px;color:#9E5C68;margin-bottom:16px}
.mk-fs-card h3{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(20px,2.4vw,25px);letter-spacing:-.01em;margin:0 0 9px;line-height:1.1}
.mk-fs-card p{font-size:15px;line-height:1.6;color:#8D877D;margin:0}
.mk-bookend{max-width:1180px;margin:0 auto clamp(28px,4vw,40px)}

.mk-fifty{position:relative;padding:clamp(80px,13vw,150px) clamp(20px,5vw,64px);overflow:hidden;background:#FFFFFF;border-top:1px solid #E5E0D6;border-bottom:1px solid #E5E0D6}
.mk-fifty-watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(240px,44vw,520px);line-height:1;color:rgba(158,92,104,.06);z-index:0;pointer-events:none;user-select:none}
.mk-fifty-inner{position:relative;z-index:1;max-width:900px;margin:0 auto}
.mk-fifty-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(30px,6vw,64px);line-height:1.05;letter-spacing:-.02em;margin:0;text-wrap:balance}

.mk-look-head{max-width:760px;margin:0 auto clamp(36px,5vw,48px);padding:0 clamp(20px,5vw,64px)}
.mk-look-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(30px,5.4vw,58px);line-height:1.05;letter-spacing:-.02em;margin:0}
.mk-marquee-wrap{overflow:hidden;border-top:1px solid #E5E0D6;border-bottom:1px solid #E5E0D6;padding:clamp(20px,3vw,28px) 0}
.mk-marquee{display:flex;width:max-content;animation:mk-marquee 32s linear infinite;font-family:var(--font-fraunces),Georgia,serif;font-size:clamp(22px,3vw,38px);color:#C4BEB2;white-space:nowrap}
.mk-marquee-group{display:inline-flex;align-items:center;gap:22px;padding-right:22px}
.mk-marquee .sep{color:#E5E0D6}

.mk-closing{position:relative;min-height:76svh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000;padding:clamp(72px,11vw,130px) clamp(20px,5vw,64px)}
.mk-closing-media{position:absolute;inset:0;z-index:0}
.mk-closing-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-closing-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35) 45%,rgba(0,0,0,.72))}
.mk-closing-inner{position:relative;z-index:2;text-align:center;max-width:900px}
.mk-closing-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(38px,8vw,92px);line-height:1;letter-spacing:-.03em;margin:0 0 clamp(24px,3.4vw,34px);color:#F7F4EF;text-wrap:balance}
.mk-closing-note{font-size:14px;color:rgba(247,244,239,.6);margin:20px 0 0}

@media(prefers-reduced-motion:reduce){.mk-marquee,.mk-badge-dot{animation:none}}
`

const MarqueeGroup = ({ hidden = false }: { hidden?: boolean }) => (
  <span className="mk-marquee-group" aria-hidden={hidden || undefined}>
    {DISCIPLINES.map((d) => (
      <span key={d} style={{ display: 'contents' }}>
        <span>{d}</span>
        <span className="sep">·</span>
      </span>
    ))}
    <span className="mk-serif-i mk-accent">every movement in between</span>
    <span className="sep">·</span>
  </span>
)

export default function FoundingPage() {
  return (
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />

      <div className="mk" id="top">
        <MarketingNav pill={{ label: 'Join waitlist', href: WAITLIST_HREF }} />

        {/* ================= HERO ================= */}
        {/* TODO(footage): full-bleed studio/class video when licensed; poster stands in now. */}
        <section className="mk-hero">
          <div id="ss-hero-media" className="mk-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-fs-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-hero-scrim" />

          {/* Founding Studios are full — funnel new interest to the homepage waitlist */}
          <div className="mk-fs-banner">
            <span className="mk-fs-banner-dot" aria-hidden="true" />
            <span className="mk-fs-banner-text">
              <strong>Founding creator program is full.</strong> The founding class is complete.
            </span>
            <a href={WAITLIST_HREF} className="mk-fs-banner-cta">Join the waitlist →</a>
          </div>

          <div className="mk-hero-inner">
            <div data-reveal className="mk-badge">
              <span className="mk-badge-dot" />50 spaces · by application
            </div>
            <h1 data-reveal data-reveal-delay="80" className="mk-hero-h1">
              Founding<br />Studios
            </h1>
            <p data-reveal data-reveal-delay="180" className="mk-hero-sub">
              The first 50 creators building Sssion with us.
            </p>
            <a data-reveal data-reveal-delay="280" href={WAITLIST_HREF} className="mk-btn mk-btn-cream">
              Join the waitlist <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* ================= INTRO ================= */}
        <section className="mk-section">
          <div className="mk-intro">
            <p data-reveal className="mk-intro-lead">
              Sssion is a private space platform built for movement and dance creators — the people
              mainstream platforms shadowban, demonetize, and slap content warnings on for doing their art.
            </p>
            <p data-reveal data-reveal-delay="120" className="mk-intro-big">
              We&apos;re opening the doors to our first 50 Founding Studios.{' '}
              <span className="mk-serif-i mk-accent">Not a beta test — a founding class.</span>{' '}
              The creators who get in now will shape what this platform becomes.
            </p>
          </div>
        </section>

        {/* ================= WHAT YOU GET (bookended by clips) ================= */}
        <section className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6' }}>
          <div className="mk-bookend" data-reveal>
            <VideoWell poster="/redesign/ss-fs-hero.webp" ratio="16 / 7" />
          </div>
          <div className="mk-wrap">
            <div className="mk-fs-head">
              <div data-reveal className="mk-eyebrow">What you get</div>
              <p data-reveal data-reveal-delay="80" className="mk-fs-lead">
                Your own private space — a place to teach sessions, gather your community, or both.
                Your content, your people, your rules, your pricing.{' '}
                <span style={{ color: '#1D1B18', fontWeight: 600 }}>We&apos;re the infrastructure, not the landlord.</span>
              </p>
            </div>
            <div className="mk-fs-cards">
              {BENEFITS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="mk-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mk-bookend" data-reveal style={{ marginTop: 'clamp(28px,4vw,40px)', marginBottom: 0 }}>
            <VideoWell ratio="16 / 7" label="Studio film coming" />
          </div>
        </section>

        {/* ================= WHY ONLY 50 ================= */}
        <section className="mk-fifty">
          <div aria-hidden="true" className="mk-fifty-watermark">50</div>
          <div className="mk-fifty-inner">
            <div data-reveal className="mk-eyebrow" style={{ marginBottom: 22 }}>Why only 50</div>
            <p data-reveal data-reveal-delay="100" className="mk-fifty-h">
              Because we onboard every Founding Studio{' '}
              <span className="mk-serif-i mk-accent">personally.</span>
            </p>
          </div>
        </section>

        {/* ================= WHAT WE'RE LOOKING FOR ================= */}
        <section className="mk-section" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="mk-look-head">
            <div data-reveal className="mk-eyebrow">What we&apos;re looking for</div>
            <h2 data-reveal data-reveal-delay="80" className="mk-look-h">
              Movement creators who take their craft and their community seriously.
            </h2>
          </div>
          <div data-reveal className="mk-marquee-wrap">
            <div className="mk-marquee">
              <MarqueeGroup />
              <MarqueeGroup hidden />
            </div>
          </div>
        </section>

        {/* ================= CLOSING CTA ================= */}
        <section className="mk-closing">
          <div className="mk-closing-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-fs-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-closing-scrim" />
          <div className="mk-closing-inner">
            <h2 data-reveal className="mk-closing-h">Your body. Your art. Your space.</h2>
            <a data-reveal data-reveal-delay="120" href={WAITLIST_HREF} className="mk-btn mk-btn-cream">
              Join the waitlist <span aria-hidden>→</span>
            </a>
            <p data-reveal data-reveal-delay="200" className="mk-closing-note">
              Founding creator program is full — join the waitlist and we&apos;ll open your door as spots open.
            </p>
          </div>
        </section>
      </div>

      <IvoryInteractions />
      <MobileDownloadBanner />
      <MarketingFooter />
    </div>
  )
}
