'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Studio retention ROI calculator, ported from the standalone
 * sssion_studio_roi_calculator.html handoff. Same two modes and the same
 * transparent math; restyled to the redesign tokens (Bricolage/Hanken,
 * #1A1A2E palette) instead of the handoff's Fraunces/Inter theme.
 */

type Mode = 'project' | 'measure'

const css = `
.roi{font-family:var(--font-hanken),system-ui,sans-serif;color:#fff}
.roi *{box-sizing:border-box}

.roi-modes{display:flex;gap:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  border-radius:999px;padding:5px;margin:0 0 10px;width:fit-content;max-width:100%}
.roi-modes button{font-family:inherit;font-size:14px;font-weight:600;color:#9999AA;
  background:none;border:none;padding:10px 20px;border-radius:999px;cursor:pointer;transition:.25s}
.roi-modes button.on{background:#B76E79;color:#fff}
.roi-mode-note{color:#9999AA;font-size:13.5px;line-height:1.55;margin:0 0 28px;max-width:60ch}

.roi-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
@media(max-width:820px){.roi-grid{grid-template-columns:1fr}}

.roi-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;
  padding:clamp(22px,3vw,32px)}
.roi-card h3{font-family:var(--font-bricolage),sans-serif;font-weight:700;font-size:clamp(19px,2.2vw,22px);
  letter-spacing:-.01em;margin:0 0 4px}
.roi-hint{color:#9999AA;font-size:13px;line-height:1.55;margin:0 0 22px}

.roi-field{margin-bottom:20px}
.roi-field:last-child{margin-bottom:0}
.roi-field label{display:block;font-size:13.5px;font-weight:500;color:#D3D3DE;margin-bottom:8px}
.roi-field .lab-val{float:right;color:#D89AA3;font-weight:600;font-variant-numeric:tabular-nums}
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
  border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:clamp(26px,4vw,38px);
  text-align:center;position:relative;overflow:hidden}
.roi-rlabel{font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#9999AA;font-weight:600}
.roi-bignum{font-family:var(--font-bricolage),sans-serif;font-weight:700;
  font-size:clamp(44px,9vw,80px);line-height:1;letter-spacing:-.02em;color:#D89AA3;
  margin:12px 0 6px;font-variant-numeric:tabular-nums;transition:color .2s}
.roi-bignum.flash{color:#fff}
.roi-bignum-sub{color:#D3D3DE;font-size:15px}
.roi-breakdown{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:26px;
  border-top:1px solid rgba(255,255,255,.1);padding-top:22px}
.roi-stat{min-width:120px}
.roi-stat .v{font-family:var(--font-bricolage),sans-serif;font-weight:600;font-size:24px;color:#fff;font-variant-numeric:tabular-nums}
.roi-stat .k{font-size:12px;color:#9999AA;margin-top:2px}
.roi-foot{margin-top:22px;color:#9999AA;font-size:12.5px;line-height:1.6;text-align:center;max-width:64ch;margin-left:auto;margin-right:auto}
.roi .hide{display:none}
`

const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

function Range({
  id, min, max, step, value, onChange,
}: {
  id: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range" id={id} min={min} max={max} step={step} value={value}
      style={{ backgroundSize: `${pct}% 100%` }}
      onChange={(e) => onChange(+e.target.value)}
    />
  )
}

export default function StudioRoiCalculator() {
  const [mode, setMode] = useState<Mode>('project')
  const [students, setStudents] = useState(150)
  const [fee, setFee] = useState(120)
  const [churn, setChurn] = useState(8)
  const [reduce, setReduce] = useState(25)
  const [churnHub, setChurnHub] = useState(5)
  const [churnNon, setChurnNon] = useState(9)

  // Same model as the handoff calculator: students kept per year × ~6 more
  // months of fees per kept student.
  let keptPerYear = 0
  if (mode === 'project') {
    const lostNow = students * (churn / 100) * 12
    const lostHub = students * (churn / 100) * (1 - reduce / 100) * 12
    keptPerYear = lostNow - lostHub
  } else {
    keptPerYear = students * Math.max(0, (churnNon - churnHub) / 100) * 12
  }
  const perStudentYear = fee * 6
  const retained = keptPerYear * perStudentYear

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

      <div className="roi-modes" role="tablist">
        <button className={mode === 'project' ? 'on' : ''} onClick={() => setMode('project')}>
          Project the opportunity
        </button>
        <button className={mode === 'measure' ? 'on' : ''} onClick={() => setMode('measure')}>
          Measure real results
        </button>
      </div>
      <p className="roi-mode-note">
        {mode === 'project'
          ? 'Projection mode: estimate the revenue a community hub could protect, based on a churn improvement you choose. A what-if, until your beta gives you real numbers.'
          : 'Measurement mode: enter the churn you actually observed for hub members vs. non-members. This turns your beta into a real ROI story.'}
      </p>

      <div className="roi-grid">
        <div className="roi-card">
          <h3>Your studio</h3>
          <p className="roi-hint">The basics we need either way.</p>

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

          {mode === 'project' ? (
            <>
              <div className="roi-field">
                <label htmlFor="roi-churn">
                  Current monthly churn <span className="lab-val">{churn}%</span>
                </label>
                <Range id="roi-churn" min={1} max={25} step={0.5} value={churn} onChange={setChurn} />
                <p className="roi-hint" style={{ margin: '8px 0 0' }}>
                  The share of students who leave each month. Don&apos;t know it? 5–10% is typical for studios.
                </p>
              </div>
              <div className="roi-field">
                <label htmlFor="roi-reduce">
                  Churn reduction from the hub <span className="lab-val">{reduce}%</span>
                </label>
                <Range id="roi-reduce" min={5} max={50} step={1} value={reduce} onChange={setReduce} />
                <div className="roi-scenarios">
                  {[
                    { r: 10, l: 'Conservative' },
                    { r: 25, l: 'Moderate' },
                    { r: 40, l: 'Optimistic' },
                  ].map((s) => (
                    <button key={s.r} className={reduce === s.r ? 'on' : ''} onClick={() => setReduce(s.r)}>
                      {s.l}
                    </button>
                  ))}
                </div>
                <p className="roi-hint" style={{ margin: '12px 0 0' }}>
                  A hub keeps students engaged between classes. This is the estimated cut in churn —
                  your beta will replace this with a real number.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="roi-field">
                <label htmlFor="roi-churn-hub">
                  Churn among hub members <span className="lab-val">{churnHub}%</span>
                </label>
                <Range id="roi-churn-hub" min={0} max={25} step={0.5} value={churnHub} onChange={setChurnHub} />
              </div>
              <div className="roi-field">
                <label htmlFor="roi-churn-non">
                  Churn among non-members <span className="lab-val">{churnNon}%</span>
                </label>
                <Range id="roi-churn-non" min={0} max={25} step={0.5} value={churnNon} onChange={setChurnNon} />
                <p className="roi-hint" style={{ margin: '8px 0 0' }}>
                  The observed gap between joiners and non-joiners is your real, honest ROI signal.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="roi-card">
          <h3>{mode === 'project' ? 'What the hub protects' : 'What the hub actually protected'}</h3>
          <p className="roi-hint">
            {mode === 'project'
              ? 'Estimated revenue retained per year.'
              : 'Revenue retained per year, from observed results.'}
          </p>

          <div className="roi-result">
            <div className="roi-rlabel">Retained revenue / year</div>
            <div className={`roi-bignum${flash ? ' flash' : ''}`}>{fmt(retained)}</div>
            <div className="roi-bignum-sub">from students you already have</div>

            <div className="roi-breakdown">
              <div className="roi-stat">
                <div className="v">{Math.round(keptPerYear).toLocaleString()}</div>
                <div className="k">students kept / year</div>
              </div>
              <div className="roi-stat">
                <div className="v">{fmt(retained / 12)}</div>
                <div className="k">retained / month</div>
              </div>
              <div className="roi-stat">
                <div className="v">{fmt(perStudentYear)}</div>
                <div className="k">value of one kept student</div>
              </div>
            </div>
          </div>

          <p className="roi-foot">
            {mode === 'project'
              ? `This is an estimate, not a guarantee. It assumes a kept student stays, on average, another 6 months at ${fmt(fee)}/mo. Adjust the churn-reduction estimate once your beta gives you a real figure.`
              : 'Based on the churn gap you observed between hub members and non-members, valuing a kept student at ~6 months of fees. Honest and directional — your real case study.'}
          </p>
        </div>
      </div>
    </div>
  )
}
