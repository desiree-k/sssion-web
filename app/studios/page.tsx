import type { Metadata } from 'next'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import VideoWell from '@/components/marketing/VideoWell'
import IvoryInteractions from '@/components/marketing/IvoryInteractions'
import StudioRoiCalculator from './StudioRoiCalculator'
import {
  MARKETING_CSS,
  marketingFontVars,
  MarketingNav,
  MarketingFooter,
} from '@/components/marketing/MarketingChrome'

const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

export const metadata: Metadata = {
  title: 'For Studios | Sssion',
  description:
    'Keep your students engaged between classes. Sssion gives your studio an online community hub that protects retention — a supplement to your in-person classes, not a replacement.',
}

// Studio-tier capabilities. Staff (studio_staff), Rooms (community_channels),
// and Retention ship today; white-label is on the roadmap and is marked "soon".
const CAPABILITIES = ['Staff & instructors', 'Rooms', 'Retention']

const HOW_IT_WORKS = [
  { n: '01', d: 40, h: 'We set up your Sssion Space', p: 'A private online home for your studio, with your name on it. We set it up with you, personally.' },
  { n: '02', d: 100, h: 'Invite your students', p: 'Your members join your Space — no algorithm, no strangers, just the people who train with you.' },
  { n: '03', d: 160, h: 'Keep the conversation going', p: 'Share content, celebrate progress, keep the community talking between classes.' },
  { n: '04', d: 220, h: 'Students keep the habit', p: 'Connected students stay motivated — and motivated students keep showing up to class.' },
]

const SOLUTION_POINTS = [
  { n: '01', d: 40, h: 'A hub, not a rival', p: 'Sssion is a supplement to your studio, not a competitor. Everything in your Space points students back to the room.' },
  { n: '02', d: 100, h: 'Community between classes', p: 'Your students connect with each other and with you in the days between sessions — the days when the habit slips.' },
  { n: '03', d: 160, h: 'Your content, your people', p: 'Post what keeps your community engaged: recaps, drills, wins, announcements. Your Space, your rules.' },
]

const css = `
@keyframes mk-pulse{0%,100%{box-shadow:0 0 0 0 rgba(158,92,104,.5)}50%{box-shadow:0 0 0 6px rgba(158,92,104,0)}}

.mk-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#000}
.mk-hero-media{position:absolute;inset:-4% 0;z-index:0;will-change:transform}
.mk-hero-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.36) 0%,rgba(0,0,0,.08) 30%,rgba(0,0,0,.2) 56%,rgba(0,0,0,.82) 100%)}
.mk-hero-inner{position:relative;z-index:2;width:100%;max-width:1240px;margin:0 auto;padding:0 clamp(20px,5vw,64px) clamp(60px,10vw,110px)}
.mk-hero-copy{max-width:860px}
.mk-badge{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:600;letter-spacing:.02em;color:rgba(247,244,239,.85);border:1px solid rgba(247,244,239,.28);border-radius:999px;padding:8px 15px;margin:0 0 22px;background:rgba(0,0,0,.25)}
.mk-badge-dot{width:7px;height:7px;border-radius:50%;background:#9E5C68;animation:mk-pulse 2.4s ease-in-out infinite}
.mk-hero-h1{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(46px,9vw,108px);line-height:.92;letter-spacing:-.03em;margin:0 0 clamp(16px,2.4vw,24px);color:#F7F4EF;text-wrap:balance}
.mk-hero-sub{font-size:clamp(18px,2.4vw,24px);line-height:1.45;color:rgba(247,244,239,.85);margin:0 0 clamp(24px,3.4vw,32px);max-width:620px}
.mk-btn-cream{background:#F7F4EF;color:#1D1B18;border:1px solid #F7F4EF}
.mk-btn-cream:hover{background:#fff;transform:translateY(-1px)}

.mk-intro{max-width:900px;margin:0 auto}
.mk-intro-lead{font-size:clamp(18px,2.4vw,25px);line-height:1.5;color:#4A463F;margin:0 0 clamp(24px,3.2vw,36px);text-wrap:pretty}
.mk-intro-big{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(26px,4.2vw,46px);line-height:1.16;letter-spacing:-.02em;margin:0;text-wrap:balance}

.mk-fs-head{max-width:720px;margin-bottom:clamp(32px,4.5vw,48px)}
.mk-fs-lead{font-size:clamp(17px,2.2vw,22px);line-height:1.55;color:#8D877D;margin:0;text-wrap:pretty}
.mk-caps{display:flex;flex-wrap:wrap;gap:9px;margin:clamp(22px,3vw,30px) 0}
.mk-tag--soon{color:#8D877D;border-style:dashed}
.mk-soon{font-style:normal;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9E5C68;margin-left:7px}
.mk-band{margin:0 0 clamp(28px,4vw,40px)}
.mk-fs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:#E5E0D6;border:1px solid #E5E0D6;border-radius:20px;overflow:hidden}
.mk-fs-card{background:#FFFFFF;padding:clamp(26px,3vw,36px)}
.mk-fs-card .num{font-family:var(--font-fraunces),Georgia,serif;font-size:15px;color:#9E5C68;margin-bottom:16px}
.mk-fs-card h3{font-family:var(--font-fraunces),Georgia,serif;font-weight:500;font-size:clamp(20px,2.4vw,25px);letter-spacing:-.01em;margin:0 0 9px;line-height:1.1}
.mk-fs-card p{font-size:15px;line-height:1.6;color:#8D877D;margin:0}
.mk-calc-head{max-width:760px;margin-bottom:clamp(32px,4.5vw,48px)}

.mk-closing{position:relative;min-height:78svh;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000;padding:clamp(72px,11vw,130px) clamp(20px,5vw,64px)}
.mk-closing-media{position:absolute;inset:0;z-index:0}
.mk-closing-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mk-closing-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.4) 45%,rgba(0,0,0,.72))}
.mk-closing-inner{position:relative;z-index:2;text-align:center;max-width:860px}
.mk-closing-h{font-family:var(--font-fraunces),Georgia,serif;font-weight:400;font-size:clamp(34px,6.6vw,74px);line-height:1.02;letter-spacing:-.03em;margin:0 0 clamp(20px,3vw,28px);color:#F7F4EF;text-wrap:balance}
.mk-closing-sub{font-size:clamp(16px,2.2vw,21px);line-height:1.5;color:rgba(247,244,239,.82);margin:0 auto clamp(28px,4vw,38px);max-width:600px;text-wrap:pretty}
.mk-closing-note{font-size:14px;line-height:1.6;color:rgba(247,244,239,.6);margin:22px 0 0}

@media(prefers-reduced-motion:reduce){.mk-badge-dot{animation:none}}
`

export default function StudiosPage() {
  return (
    <div className={marketingFontVars}>
      <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS + css }} />

      <div className="mk" id="top">
        <MarketingNav pill={{ label: 'Talk to us', href: STUDIO_MAILTO }} />

        {/* ================= HERO ================= */}
        {/* TODO(footage): full-bleed class/community footage when licensed; poster stands in now. */}
        <section className="mk-hero">
          <div id="ss-hero-media" className="mk-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-st-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-hero-scrim" />
          <div className="mk-hero-inner">
            <div className="mk-hero-copy">
              <div data-reveal className="mk-badge">
                <span className="mk-badge-dot" />Sssion for Studios
              </div>
              <h1 data-reveal data-reveal-delay="80" className="mk-hero-h1">
                Keep the students you worked <span className="mk-serif-i mk-accent">so hard</span> to get.
              </h1>
              <p data-reveal data-reveal-delay="180" className="mk-hero-sub">
                Sssion gives your studio an online community hub that keeps students connected
                between classes — so the habit sticks, and they keep coming back.
              </p>
              <a data-reveal data-reveal-delay="280" href={STUDIO_MAILTO} className="mk-btn mk-btn-cream">
                Talk to us about your studio <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ================= THE PROBLEM ================= */}
        <section className="mk-section">
          <div className="mk-intro">
            <div data-reveal className="mk-eyebrow">The quiet leak</div>
            <p data-reveal data-reveal-delay="60" className="mk-intro-lead">
              Most studios don&apos;t lose students in dramatic ways. They drift. A missed week
              becomes a missed month, the habit fades, and one day a student you loved teaching
              just isn&apos;t on the schedule anymore. You already paid to win them — in marketing,
              in intro offers, in your own time — and the recurring revenue they represented
              quietly walks out the door.
            </p>
            <p data-reveal data-reveal-delay="140" className="mk-intro-big">
              Keeping a student costs far less than winning a new one.{' '}
              <span className="mk-serif-i mk-accent">Retention is the most valuable lever a studio has.</span>
            </p>
          </div>
        </section>

        {/* ================= THE SOLUTION ================= */}
        <section className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6', borderBottom: '1px solid #E5E0D6' }}>
          <div className="mk-wrap">
            <div className="mk-fs-head">
              <div data-reveal className="mk-eyebrow">What Sssion is</div>
              <h2 data-reveal data-reveal-delay="60" className="mk-h2">
                Your studio&apos;s community, carried between classes.
              </h2>
              <p data-reveal data-reveal-delay="120" className="mk-fs-lead" style={{ marginTop: 18 }}>
                A private Sssion Space where your students connect, share progress, and stay
                motivated in the days between sessions.{' '}
                <span style={{ color: '#1D1B18', fontWeight: 600 }}>
                  It&apos;s not here to move your studio online — it&apos;s here to keep your
                  students coming back to it.
                </span>
              </p>
              {/* B2B inflection — the studio-tier capabilities, grounded in real features */}
              <div data-reveal data-reveal-delay="160" className="mk-caps">
                {CAPABILITIES.map((c) => (
                  <span key={c} className="mk-tag">{c}</span>
                ))}
                {/* On the roadmap — marked so the pitch stays honest about beta scope. */}
                <span className="mk-tag mk-tag--soon">
                  White-label<em className="mk-soon">Soon</em>
                </span>
              </div>
            </div>
            {/* TODO(footage): class + community energy — real studio class loop when licensed. */}
            <div data-reveal className="mk-band">
              <VideoWell poster="/redesign/ss-st-hero.webp" ratio="16 / 7" label="Class film coming" />
            </div>
            <div className="mk-fs-cards">
              {SOLUTION_POINTS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="mk-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= THE CALCULATOR ================= */}
        <section className="mk-section" id="calculator">
          <div className="mk-wrap">
            <div className="mk-calc-head">
              <div data-reveal className="mk-eyebrow">Run your numbers</div>
              <h2 data-reveal data-reveal-delay="60" className="mk-h2">
                What is student churn <span className="mk-serif-i mk-accent">costing</span> your studio?
              </h2>
              <p data-reveal data-reveal-delay="120" className="mk-fs-lead" style={{ marginTop: 18 }}>
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
        <section className="mk-section" style={{ background: '#FFFFFF', borderTop: '1px solid #E5E0D6', borderBottom: '1px solid #E5E0D6' }}>
          <div className="mk-wrap">
            <div className="mk-fs-head">
              <div data-reveal className="mk-eyebrow">How it works</div>
              <h2 data-reveal data-reveal-delay="60" className="mk-h2">Simple on purpose.</h2>
              <p data-reveal data-reveal-delay="120" className="mk-fs-lead" style={{ marginTop: 18 }}>
                No new software to master, no online business to run. A community hub for the
                studio you already have.
              </p>
            </div>
            <div className="mk-fs-cards">
              {HOW_IT_WORKS.map((b) => (
                <div key={b.n} data-reveal data-reveal-delay={b.d} className="mk-fs-card">
                  <div className="num">{b.n}</div>
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOUNDING STUDIOS CTA ================= */}
        <section className="mk-closing">
          <div className="mk-closing-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/redesign/ss-st-hero.webp" alt="" aria-hidden="true" />
          </div>
          <div className="mk-closing-scrim" />
          <div className="mk-closing-inner">
            <div data-reveal className="mk-eyebrow" style={{ color: 'rgba(247,244,239,.6)', marginBottom: 24 }}>Early days, honestly</div>
            <h2 data-reveal data-reveal-delay="80" className="mk-closing-h">
              We&apos;re building this with a small group of{' '}
              <span className="mk-serif-i" style={{ color: '#D9A6AE' }}>founding studio partners.</span>
            </h2>
            <p data-reveal data-reveal-delay="160" className="mk-closing-sub">
              The studio side of Sssion is in early beta — we&apos;re not selling you a finished
              product. We&apos;re inviting a handful of studio owners to shape it with us, and
              to measure what retention it actually earns.
            </p>
            <a data-reveal data-reveal-delay="240" href={STUDIO_MAILTO} className="mk-btn mk-btn-cream">
              Talk to us about your studio <span aria-hidden>→</span>
            </a>
            <p data-reveal data-reveal-delay="320" className="mk-closing-note">
              A conversation, not a sales pitch. We reply personally.
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
