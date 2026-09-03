/**
 * Open Door CTA section for the homepage — replaces the creator waitlist.
 * Keeps the section's ivory editorial styling and the #waitlist id so the
 * hero/founding "I'm a Creator" anchors still land here. The old form's
 * creator_waitlist table and data are untouched; signup is just open now.
 */

const css = `
html{scroll-behavior:smooth}
.mk-wl{position:relative;background:#FFFFFF;border-top:1px solid #E5E0D6;border-bottom:1px solid #E5E0D6;scroll-margin-top:72px}
.mk-wl-inner{max-width:600px;margin:0 auto;text-align:center}
.mk-wl-lead{font-size:clamp(16px,2vw,19px);line-height:1.6;color:#8D877D;margin:0 auto clamp(32px,5vw,44px);max-width:500px}
.mk-wl-note{margin:22px 0 0;font-size:14px;color:#8D877D}
.mk-wl-note a{color:#9E5C68;font-weight:600;border-bottom:1px solid #9E5C68;text-decoration:none}
.mk-wl-note a:hover{color:#1D1B18;border-color:#1D1B18}
`

export default function OpenDoorCta() {
  return (
    <section id="waitlist" className="mk-section mk-wl">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mk-wrap mk-wl-inner">
        <div data-reveal className="mk-eyebrow">The door is open</div>
        <h2 data-reveal data-reveal-delay="80" className="mk-h2">
          Your space is waiting
        </h2>
        <p data-reveal data-reveal-delay="160" className="mk-wl-lead">
          No waitlist, no invite codes. Create your free account, then start
          your Space in the Sssion app — free to start, and you keep 100%.
        </p>
        <div data-reveal data-reveal-delay="220">
          <a href="/signup" className="mk-btn mk-btn-ink">Start free today <span aria-hidden>→</span></a>
        </div>
        <p data-reveal className="mk-wl-note">
          Already have an account? <a href="/signin">Sign in</a>
        </p>
      </div>
    </section>
  )
}
