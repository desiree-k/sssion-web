'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Studio retention ROI calculator, ported from the standalone
 * sssion_studio_roi_public.html handoff (single projection flow, adjustable
 * re-engaged lifetime, built-in CTA + disclosure). Same math and copy;
 * restyled to the redesign tokens (Bricolage/Hanken, #1A1A2E palette)
 * instead of the handoff's Fraunces/Inter theme. The handoff's [YOUR_LINK]
 * CTA placeholder points at the studio-interest mailto used site-wide.
 */

const STUDIO_MAILTO = 'mailto:support@sssion.studio?subject=Studio%20Interest'

const css = `
.roi{font-family:var(--font-hanken),system-ui,sans-serif;color:#fff}
.roi *{box-sizing:border-box}

.roi-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
@media(max-width:820px){.roi-grid{grid-template-columns:1fr}}

.roi-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;
  padding:clamp(22px,3vw,32px)}
.roi-card h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(19px,2.2vw,22px);
  letter-spacing:-.01em;margin:0 0 4px}
.roi-hint{color:#9999AA;font-size:13px;line-height:1.55;margin:0 0 22px}

.roi-field{margin-bottom:22px}
.roi-field:last-child{margin-bottom:0}
.roi-field label{display:block;font-size:13.5px;font-weight:500;color:#D3D3DE;margin-bottom:8px}
.roi-field .lab-val{float:right;color:#D89AA3;font-weight:600;font-variant-numeric:tabular-nums}
.roi-sublabel{color:#9999AA;font-size:12px;line-height:1.6;margin:8px 0 0}
.roi-sublabel .lab-val{float:none;color:#D89AA3;font-weight:600}
.roi-money{position:relative}
.roi-money span{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9999AA;font-size:15px}
.roi input[type=number]{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);
  border-radius:10px;color:#fff;font-family:inherit;font-size:15px;padding:12px 14px}
.roi-money input{padding-left:28px}
.roi input[type=number]:focus{outline:none;border-color:#C88793;box-shadow:0 0 0 3px rgba(183,110,121,.22)}
.roi input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:6px;border-radius:6px;
  background:linear-gradient(90deg,#B76E79,#C88793) no-repeat rgba(255,255,255,.1);cursor:pointer;margin-top:4px}
.roi input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;
  background:#fff;border:3px solid #B76E79;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.roi input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;
  border:3px solid #B76E79;cursor:pointer}

.roi-scenarios{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
.roi-scenarios button{font-family:inherit;font-size:12.5px;font-weight:600;color:#D3D3DE;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:999px;
  padding:8px 16px;cursor:pointer;transition:.2s}
.roi-scenarios button:hover{border-color:#C88793}
.roi-scenarios button.on{background:rgba(183,110,121,.2);border-color:#C88793;color:#fff}

.roi-result{margin-top:24px;background:
    radial-gradient(90% 120% at 85% 0%, rgba(183,110,121,.14), transparent 60%),
    rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:clamp(26px,4vw,36px);text-align:center}
.roi-rlabel{font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#9999AA;font-weight:600}
.roi-bignum{font-family:var(--font-bricolage),sans-serif;font-weight:700;
  font-size:clamp(44px,9vw,80px);line-height:1;letter-spacing:-.02em;color:#D89AA3;
  margin:12px 0 6px;font-variant-numeric:tabular-nums;transition:color .2s}
.roi-bignum.flash{color:#fff}
.roi-bignum-sub{color:#D3D3DE;font-size:15px}
.roi-breakdown{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:26px;
  border-top:1px solid rgba(255,255,255,.1);padding-top:22px}
.roi-stat{min-width:120px}
.roi-stat .v{font-family:var(--font-bricolage),sans-serif;font-weight:600;font-size:23px;color:#fff;font-variant-numeric:tabular-nums}
.roi-stat .k{font-size:12px;color:#9999AA;margin-top:2px}

.roi-cta{margin-top:26px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:20px;padding:clamp(24px,3vw,32px);text-align:center}
.roi-cta h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(20px,3vw,26px);
  letter-spacing:-.01em;margin:0 0 10px}
.roi-cta p{color:#D3D3DE;font-size:15px;line-height:1.6;max-width:52ch;margin:0 auto 20px}
.roi-btn{display:inline-block;background:#B76E79;color:#fff;font-family:inherit;font-weight:600;font-size:15px;
  text-decoration:none;padding:14px 30px;border-radius:999px;transition:.2s;border:none;cursor:pointer}
.roi-btn:hover{background:#C88793;transform:translateY(-1px)}

.roi-disclosure{margin-top:20px;color:#9999AA;font-size:12px;text-align:center;max-width:64ch;
  margin-left:auto;margin-right:auto;line-height:1.6}
`

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

function Range({
  id, min, max, step, value, onChange, style,
}: {
  id: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void; style?: React.CSSProperties
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range" id={id} min={min} max={max} step={step} value={value}
      style={{ backgroundSize: `${pct}% 100%`, ...style }}
      onChange={(e) => onChange(+e.target.value)}
    />
  )
}

export default function StudioRoiCalculator() {
  const [students, setStudents] = useState(150)
  const [fee, setFee] = useState(120)
  const [churn, setChurn] = useState(8)
  const [life, setLife] = useState(6)
  const [reduce, setReduce] = useState(25)

  // Same model as the handoff: students lost/yr × the share a community
  // keeps, each worth `life` more months of fees.
  const lostNow = students * (churn / 100) * 12
  const keptPerYear = lostNow * (reduce / 100)
  const perStudent = fee * life
  const retained = keptPerYear * perStudent

  const [flash, setFlash] = useState(false)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 120)
    return () => clearTimeout(t)
  }, [retained])

  return (
    <div className="roi">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="roi-grid">
        <div className="roi-card">
          <h3>Your studio</h3>
          <p className="roi-hint">Rough numbers are fine — this is an estimate.</p>

          <div className="roi-field">
            <label htmlFor="roi-students">
              Active students <span className="lab-val">{students}</span>
            </label>
            <Range id="roi-students" min={10} max={600} step={5} value={students} onChange={setStudents} />
          </div>

          <div className="roi-field">
            <label htmlFor="roi-fee">Average monthly fee per student</label>
            <div className="roi-money">
              <span>$</span>
              <input
                type="number" id="roi-fee" min={0} value={fee}
                onChange={(e) => setFee(Math.max(0, +e.target.value || 0))}
              />
            </div>
          </div>

          <div className="roi-field">
            <label htmlFor="roi-churn">
              How many students do you lose each month? <span className="lab-val">{churn}%</span>
            </label>
            <Range id="roi-churn" min={1} max={25} step={0.5} value={churn} onChange={setChurn} />
            <p className="roi-sublabel">
              Not sure? Most studios lose somewhere between 5% and 10% of students a month.
            </p>
          </div>

          <div className="roi-field">
            <label htmlFor="roi-life">
              How long does a student usually stay once re-engaged? <span className="lab-val">{life} mo</span>
            </label>
            <Range id="roi-life" min={2} max={18} step={1} value={life} onChange={setLife} />
            <p className="roi-sublabel">
              A student you keep from leaving stays, on average, this many more months.
            </p>
          </div>

          <div className="roi-field">
            <label style={{ marginBottom: 2 }}>How much could a community keep them?</label>
            <div className="roi-scenarios">
              {[
                { r: 10, l: 'Modest' },
                { r: 25, l: 'Realistic' },
                { r: 40, l: 'Strong' },
              ].map((s) => (
                <button key={s.r} className={reduce === s.r ? 'on' : ''} onClick={() => setReduce(s.r)}>
                  {s.l}
                </button>
              ))}
            </div>
            <Range id="roi-reduce" min={5} max={50} step={1} value={reduce} onChange={setReduce} style={{ marginTop: 14 }} />
            <p className="roi-sublabel">
              <span className="lab-val">{reduce}%</span> fewer students lost — because a community keeps
              them engaged between classes, so they keep the habit and keep coming back.
            </p>
          </div>
        </div>

        <div className="roi-card">
          <h3>What it could be worth</h3>
          <p className="roi-hint">Retained revenue, per year — from students you already have.</p>

          <div className="roi-result">
            <div className="roi-rlabel">Revenue kept / year</div>
            <div className={`roi-bignum${flash ? ' flash' : ''}`}>{fmt(retained)}</div>
            <div className="roi-bignum-sub">from students who stay instead of drifting away</div>

            <div className="roi-breakdown">
              <div className="roi-stat">
                <div className="v">{Math.round(keptPerYear).toLocaleString()}</div>
                <div className="k">students kept / year</div>
              </div>
              <div className="roi-stat">
                <div className="v">{fmt(retained / 12)}</div>
                <div className="k">kept / month</div>
              </div>
              <div className="roi-stat">
                <div className="v">{fmt(perStudent)}</div>
                <div className="k">value of one kept student</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="roi-cta">
        <h3>Want this for your studio?</h3>
        <p>
          We&apos;re building Sssion with a small group of founding studios — giving your students a
          place to connect, train, and stay engaged between classes, so they keep coming back.
          Let&apos;s talk about whether it&apos;s a fit for yours.
        </p>
        <a className="roi-btn" href={STUDIO_MAILTO}>Talk to us about your studio →</a>
      </div>

      <p className="roi-disclosure">
        This is an estimate based on the numbers you entered, to help you think through the value of
        student retention — not a guarantee. Every studio is different. The best way to know what a
        community could do for your studio is to try it.
      </p>
    </div>
  )
}
