# Marketing Copy v2 — Sssion (post–Open Door)

**Status:** Draft for review. Copy only — no code changed.
**Purpose:** Rework the marketing site to describe what Sssion *is* now. The live pages predate the Open Door model (private → publish → sell). This draft answers the three questions a visitor or partner should never have to ask:

1. **What does it do?** — Gives movement creators and studios a Space they own: community, library, offerings.
2. **What's it building toward?** — The ladder: start free, publish (reviewed), sell.
3. **Why does it exist?** — Movement artists deserve infrastructure that treats their art as art.

**Voice guardrails held throughout:** editorial, warm, direct. Short sentences. No "empower / seamless / all-in-one," no pricing tables, no feature-grid soup. "Your people," "your Space," "your art." Waitlist language is dead; the CTA is **Start free today**. Founding program is closed and its page is being **retired** (§6). Built-in checkout is **coming soon**, never described as live.

**Decisions applied in this revision** (founder review):
1. **0% platform fee is _not_ a permanent commitment** — "keep 100% / no cuts / never take a cut" removed everywhere; reframed to "you set your prices, you keep the member relationship."
2. **Live classes are live _now_** — hosted over **Google Meet / Zoom** today; *native in-app* streaming with auto-recordings is framed as next. Roadmap and ladder updated to match.
3. **`/features` CTA → `/signup`** (was the dead `/join` invite door).
4. **The Creator/Member fork is gone** — a single `Start free today` CTA on the homepage hero and closing.
5. **`/founding` is retired** — the page is no longer needed; §6 now covers how to take it down cleanly (redirect, sitemap, blog CTA) instead of a copy rewrite.

> **How to read this:** each page is broken into blocks that map to the sections already in the code (`app/page.tsx`, `app/studios/page.tsx`, etc.), so this can be lifted in section-by-section. Anything that contradicts the new model is called out in **§7 Contradictions to fix** at the end — read that first if you're short on time.

---

## 1. Boilerplate — "What is Sssion" (3 sentences)

> Sssion is the platform where movement creators and dance studios own their communities — pole, heels, floorwork, contemporary, flexibility, and every discipline mainstream platforms shadowban and bury. Each creator gets a Space: a video-first home for their people, their session library, and their offerings — invite-only and free to start. When they're ready, they apply to be discovered, go public, and sell — on their own terms, with no algorithm deciding who gets seen.

*(Use as meta description, About blurb, app-store short description, press one-liner.)*

---

## 2. Partner-facing platform description (1 paragraph, reusable in email)

> Sssion is the home base for movement and dance — the platform where creators and studios own their communities instead of renting an audience from an algorithm. Every creator starts with a private Space: a video-first feed, rooms, chat, a session library, and their offerings, free and invite-only. When they're ready, they apply to be discoverable — and every Space is personally reviewed before it goes public, which also unlocks live classes (hosted over Google Meet or Zoom today, with native in-app streaming on the way). Built-in checkout for memberships, workshops, and drop-ins is coming soon. Studios extend the same thing to the physical world: rooms per class and instructor, staff accounts for teachers, and a community that keeps members engaged between sessions. Every published Space is human-reviewed and its media monitored, everyone on camera is 18+, and creators keep control of their pricing and their member relationships. Art treated as art — communities over followers, direct relationships over reach.

---

## 3. Homepage — `/`

The current homepage tells *why* and *who it's for*, but never tells the **ladder** — the single most important thing about Sssion now. Below keeps the existing section rhythm (hero → why → members → creators → in-motion → CTA → closing) and **inserts one new section: "How it works — the ladder."**

### HERO
- **Eyebrow:** `Own your community`
  *(replaces "Private space platform" — "private" is only the first rung; it undersells the model.)*
- **H1:** `Own your\nmovement.` *(keep — it's the line, and it's on the footer and closing already.)*
- **Subhead:** `The home for movement creators and their people. Your Space, your community, your art — not an audience you rent from an algorithm.`
- **CTA (single):** `Start free today` → `/signup`. The App Store badge already sits below the CTA — keep it as a quiet download option, not a co-equal audience choice.
  *(Fork removed per decision — Open Door is one door. See §7G.)*

### WHY SSSION EXISTS *(keep section; tighten copy)*
- **Eyebrow:** `Why Sssion exists`
- **H2:** `Built because movement deserves better.`
- **Body:** `Pole, heels, floorwork, contemporary, flexibility, yoga and flow — the disciplines mainstream platforms shadowban, demonetize, and bury under content warnings. Sssion is a home built for this art, on the artist's terms. No algorithm deciding who gets seen. No sudden deplatforming. No platform that owns your audience.`
- **Chips:** `No algorithm` · `No shadowbans` · `Yours to keep`
  *(swap "No cuts" → "Yours to keep": "No cuts" is a fee/monetization claim, and checkout isn't live — see §7.)*

### ★ NEW SECTION — HOW IT WORKS: THE LADDER
> This is the spine of the new story and it's currently missing. Three cards, same `.mk-card` pattern already used in the "For creators" band.

- **Eyebrow:** `How it works`
- **H2:** `Start free. Publish when you're ready. Sell on your terms.`
- **Intro:** `Sssion grows with you. You're never charged to begin, and nothing goes public until you say so.`

- **Card 01 — Start free**
  `Open a private Space in minutes — invite-only by link, free to begin. A home for your people, not an audience to rent. Share video, build your library, and start the conversation that's actually yours.`

- **Card 02 — Publish**
  `When you're ready to be found, apply to go public. Every Space is reviewed by a real person first — curation is a feature, not a bottleneck. Publishing also unlocks live classes: go live with your members today over Google Meet or Zoom, with native in-app live on the way.`

- **Card 03 — Sell**
  `When the community's there, the livelihood can follow — memberships, workshops, drop-ins, live-class tickets. You set your prices. You keep the relationship with your members. Built-in checkout is coming soon.`

- **CTA:** `Start free today` → `/signup`

### FOR MEMBERS *(keep; light touch)*
- **Eyebrow:** `For members`
- **H2:** `Find your people. Move together.`
- **Body:** `Discover creators whose style moves you. Train on-demand at your own pace, join live classes, and belong to a real community — not a feed. Follow the movement you love without an algorithm burying it.`
- **Link:** `Explore Spaces →` → `/discover`

### FOR CREATORS *(keep band + 3 cards; rewrite card 03)*
- **Eyebrow:** `For creators`
- **H2:** `Your Space. Your community. Your terms.`
- **Body:** `A home for your art, with the infrastructure to run it — and no algorithm standing between you and the people who move with you.`
- **Card 01 — Your Space:** `Upload your sessions, build your library, and make the Space unmistakably yours — video-first, room by room.`
- **Card 02 — Your community:** `Posts, progress, rooms, and chat — the people who move with you, gathered in one place you control.`
- **Card 03 — Your offerings** *(REWRITE — see §7):* `Memberships, workshops, drop-ins, live-class tickets. You set the prices and keep the member relationship. Built-in checkout is coming soon.`
  *(Removes the current "Keep 100%. No cuts, no commissions." — that's an unshipped fee promise. See §7.)*
- **CTA:** `Start your Space →` → `/signup`

### IN MOTION *(keep as-is — footage/energy section, no model claims)*
- **Eyebrow:** `In motion` · **H2:** `The energy of Discover.` · body unchanged.

### OPEN DOOR CTA *(component already correct — `OpenDoorCta.tsx`)*
- Keep. Copy already reads "No waitlist, no invite codes… free to start." One edit for §7: the line "you keep 100%" should become **"on your terms"** until the fee model is confirmed.
  - Suggested: `No waitlist, no invite codes. Create your free account, then open your Space in the Sssion app — free to start, yours to grow.`

### CLOSING *(keep)*
- **H2:** `Your body. Your art. Your Space.`
- **CTA (single):** `Start free today` → `/signup`. (App Store badge optional as a quiet secondary.)
  *(Fork removed here too — one CTA.)*

---

## 4. For Studios — `/studios`

Direction is right (retention, ROI calculator, honest "early days"). Fixes: (a) name the actual capabilities in plain terms — rooms per class/instructor, staff accounts; (b) keep it B2B and unpolished-honest. *(The old "Founding Studios" naming collision is moot now that `/founding` is retired — see §6.)*

### HERO *(keep structure)*
- **Badge:** `Sssion for Studios`
- **H1:** `Keep the students you worked *so hard* to get.` *(keep — it lands.)*
- **Subhead:** `Sssion gives your studio a community online — so the habit holds between classes, and your members keep coming back to the room.`
- **CTA:** `Talk to us about your studio` → `mailto:support@sssion.studio`

### THE QUIET LEAK *(keep — this section is strong)*
- Eyebrow `The quiet leak`, the "students drift" paragraph, and "Retention is the most valuable lever a studio has." — all on-message. No change.

### WHAT SSSION IS *(keep; make the capabilities concrete)*
- **Eyebrow:** `What Sssion is`
- **H2:** `Your studio's community, carried between classes.`
- **Body:** `A private Space for your studio online — rooms for each class, instructor, or vibe; staff accounts for your teachers; a feed and chat where members stay connected in the days between sessions. It's not here to move your studio online. It's here to keep members coming back to it.`
- **Capabilities chips:** `Rooms per class` · `Staff & instructor accounts` · `Member retention` · `White-label` *(keep "Soon" tag on white-label)*
  *(Grounds the chips in real features: `community_channels` = Rooms, `studio_staff` = Staff. Matches the code comment already in the file.)*

- **3 solution cards** *(keep — lightly retuned):*
  - `A hub, not a rival` — `Everything in your Space points members back to the room. A supplement to your studio, never a replacement.`
  - `Community between classes` — `Members connect with each other and with you on the days the habit usually slips.`
  - `Your rooms, your people` — `Recaps, drills, wins, announcements — organized by class or instructor. Your Space, your rules.`

### THE CALCULATOR *(keep entirely — ROI calc is a genuine asset)*
- No copy change. Eyebrow `Run your numbers`, "What is student churn *costing* your studio?" stays.

### HOW IT WORKS *(keep — "Simple on purpose." is good)*
- Keep the 4-step set-up flow. One tweak to step 01 to reflect that studios go through the same review as everyone: `We set up your Space with you — personally — and get it reviewed and ready to publish.`

### CLOSING — STUDIO PARTNERS *(keep the honesty)*
- **Eyebrow:** `Early days, honestly`
- **H2:** `We're building this with a small group of *studio partners.*`
- **Sub:** `The studio side of Sssion is young. We're not selling you a finished product — we're inviting a handful of studio owners to shape it with us, and to measure the retention it actually earns.`
- **CTA:** `Talk to us about your studio →` · **Note:** `A conversation, not a sales pitch. We reply personally.`
  *("Founding studio partners" is fine to keep or drop — with `/founding` retired there's no longer a naming collision. "Studio partners" reads cleanest.)*

---

## 5. Features — `/features`

Mostly aligned (free core, "Coming" tags, honest roadmap). Three real problems: (a) the page still promises **"We'll never take a cut of what you earn"** — a hard fee commitment that predates the checkout plan; (b) the roadmap lists **"Live sessions" under _Now_** when live is still rolling out; (c) the bottom CTA points to **`/join`** (invite-only, dead) instead of `/signup`.

### HERO *(keep)*
- **Eyebrow:** `Features & pricing`
- **H1:** `Start free.\nAlways.`
- **Subhead:** `Building your community on Sssion is free — and the core of what we do always will be.`

### GROW WHEN YOU'RE READY *(keep — all four cards already tagged "Coming")*
- **H2:** `More, only when you want it.`
- **Body:** `Some creators reach a point where they want more — to earn from their work, to teach live, to run something bigger. When you do, the tools are here.`
- Cards (keep "Coming" tag on each — these are the *paid/upgrade* tools, all still ahead):
  - `Earn from your community` — `Memberships, workshops, drop-ins, and ticketed live classes.`
  - `Scale your library` — `More sessions, more storage, deeper tools as you grow.`
  - `Understand your growth` — `Analytics and insights that actually help.`
  - `Run multiple Spaces` — `Separate communities by location, level, or instructor.`
  *(No "Go live — Coming" card: live classes work **today** via Google Meet / Zoom. Live belongs in the ladder + the "Now" roadmap bucket, not in the paid/coming grid.)*

### FOR PHYSICAL STUDIOS *(keep — routes to /studios)*
- **H2:** `An extension of your studio — not a competitor.`
- **Body:** `Run a studio or teach in person? Sssion isn't here to compete — it's here to extend what you already do. Rooms per class, staff accounts, and a community that keeps members between sessions.`
- **Link:** `See Sssion for Studios →` → `/studios`

### OUR PROMISE *(REWRITE row 02 — see §7)*
- `01` — `The community core stays free.`
- `02` — **`You set your prices and keep your member relationships.`** *(replaces "We'll never take a cut of what you earn" — see §7. If the founder confirms 0% is a real, permanent commitment, keep the original line verbatim.)*
- `03` — `Paid tools are for when you're ready — never a wall in front of getting started.`
- `04` — `We build the paid layer *with* our creators, not *at* them.`

### WHERE WE'RE HEADED *(FIX the roadmap buckets — see §7)*
- **Now:** `Free private Spaces` · `Video-first feed, rooms & chat` · `Session library` · `Publishing & Discover` · `Live classes (Google Meet / Zoom)`
- **Rolling out:** `Native in-app live streaming (auto-recorded)` · `Built-in checkout` · `Memberships & subscriptions`
- **Ahead:** `Analytics` · `Multiple Spaces` · `Deeper studio tools`
  *(Live classes belong in _Now_ — they happen today over Meet/Zoom. What's still ahead is native streaming inside Sssion.)*

### BOTTOM CTA *(FIX the link — see §7)*
- **H2:** `Start free. Grow when you're ready.`
- **CTAs:** `Start your free Space →` → **`/signup`** *(was `/join` — invite-only/dead)* · `Talk to us about studios →` → `mailto:support@sssion.studio`

---

## 6. Founding — `/founding` → **RETIRED**

**Decision:** the founding program is closed and the page is no longer needed. No v2 copy — the page is being removed. The old draft (banner + past-tense social-proof reframe) is dropped.

**To retire it cleanly** (small implementation task, separate from the copy above — see the open question at the end of this doc):
- **Redirect the live URL**, don't just delete it — the founding sprint emails (Loops) and the blog post link here, so a bare removal creates 404s on promoted links. A 301 to `/signup` preserves the "claim your free space" intent; `/` is the safer-but-blander alternative.
- **Sitemap:** remove the `/founding` entry in `app/sitemap.ts:10`.
- **Blog CTA:** `content/blog/build-a-movement-community.mdx:115` ends with "[Claim your free space →](/founding)" — repoint to `/signup`.
- **Comments/docs:** stale `/founding` mentions in `OpenDoorCta.tsx`, `MarketingChrome.tsx`, and `CLAUDE.md` are cosmetic; clean up when convenient.
- Nav and footer **don't** link to `/founding`, so there's no chrome change.
- The "founding class" as *social proof* can still live as a line on the homepage if wanted (e.g. a quiet "Built with our first 50 creators") — but it no longer needs its own page.

---

## 7. Contradictions to fix (flagged from the live pages)

Ordered by how badly each one misleads a visitor or partner.

### 🔴 A. Unshipped monetization spoken as fact — "Keep 100% / No cuts / Never take a cut"
- **`/` For-creators card 03:** "Keep 100%. No cuts, no commissions — what you earn is yours."
- **`/` For-creators intro:** "none of the middlemen taking a cut."
- **`/features` Our promise 02:** "We'll never take a cut of what you earn."
- **`OpenDoorCta`:** "…free to start, and you keep 100%."
- **Why it's a problem:** Two things at once. (1) Checkout/payments aren't live, so "what you earn" describes a thing creators can't do on Sssion yet — reads as vaporware once they sign up and find no way to sell. (2) "Never take a cut / keep 100%" is a permanent *business-model commitment* about platform fees. The current-truth brief pointedly says creators "keep control of their pricing" but does **not** say zero fee. Repeating "keep 100%" may box in the checkout economics.
- **✅ DECIDED:** 0% is **not** a permanent commitment. Drop "keep 100% / no cuts / never take a cut" everywhere; reframe to control-and-relationship language ("you set your prices, you keep the member relationship") with checkout marked as *coming soon*. Every page block above already reflects this.

### 🔴 B. The ladder isn't told anywhere
- The homepage never explains **start free → publish (reviewed) → sell**, and never mentions that publishing is personally reviewed or that it unlocks going live. This is the core of what Sssion is now, and it's absent.
- **Fix:** the new "How it works — the ladder" section in §3.

### 🔴 C. Trust & safety is invisible to partners
- Manual review before anything is public/sellable, automated monitoring of published media, real enforcement, 18+ throughout, DMCA — all real (`/content-policy`, `/dmca`, recent moderation commits) but never surfaced on the marketing pages. Partners and studios ask about exactly this.
- **Fix — add a short trust strip** (homepage, above the closing; and/or a line on `/studios`). Link out, don't duplicate:
  > **Eyebrow:** `Trust & safety`
  > **H2:** `Curated on purpose.`
  > **Body:** `Every Space is reviewed by a real person before it goes public or sells anything. Published media is monitored automatically, everyone on camera is 18+, and we enforce it. Confidence without the corporate-speak.`
  > **Links:** `Content Policy →` `/content-policy` · `DMCA →` `/dmca`
- Also consider adding a **"Trust & safety" link in the footer** (currently `/content-policy` and `/dmca` sit under "Legal" only).

### 🟠 D. `/features` bottom CTA points to `/join` (dead door) — ✅ DECIDED
- "Start your free community" → `/join`, which is **invite-code-only** now (per CLAUDE.md). Open signup is `/signup`. A visitor clicking it hits a wall.
- **Fix:** point to `/signup`. Confirmed — done in §5.

### 🟢 E. Live classes — ✅ CLARIFIED (they're live now, via Meet/Zoom)
- Correction from the founder: live classes **do** happen today — hosted over **Google Meet or Zoom**. What's still ahead is *native, in-app* live streaming with automatic recordings.
- **Fix:** keep live in the *Now* roadmap bucket, labeled "(Google Meet / Zoom)"; put "native in-app live streaming" under *Rolling out*. The ladder's Publish card says the same. Removed the misleading "Go live — Coming" card from the Grow grid (live isn't a coming paid tool). Done in §3 and §5.

### 🟢 F. "Founding Studios" naming collision — ✅ RESOLVED by retiring `/founding`
- The collision was: `/founding` (a **creators** program titled "Founding Studios") vs. `/studios` recruiting "founding studio **partners**." With `/founding` retired (§6), there's only one "founding" usage left, so nothing collides. Recommend the `/studios` closing just say **"studio partners"** for cleanliness.

### 🟡 G. The hard "I'm a Creator / I'm a Member" fork — ✅ DECIDED
- Hero and closing on `/` split the audience into two buttons. Under Open Door there's **one door** — anyone signs up and can open a Space (per the one-door `/signup` and retired waitlist). The binary predates the model and adds a decision the visitor doesn't need.
- **✅ DECIDED:** kill the fork. Single primary CTA everywhere — `Start free today` → `/signup`. The App Store badge stays as a quiet secondary download option (not a co-equal audience choice). Applied to the homepage hero and closing in §3.

### 🟡 H. `#waitlist` anchor id still lives in the markup
- Visible copy is clean (no "waitlist" text anywhere user-facing — good). But the homepage CTAs still anchor to `#waitlist` and the section id is `#waitlist` (`OpenDoorCta`). Not visible to users; purely cosmetic/SEO-hygiene. Optional: rename to `#start` when the section is next touched. No urgency.

### 🟡 I. Hero eyebrow "Private space platform"
- Positions Sssion as *private* (rung 1 only) rather than *community ownership* (the whole ladder). Undersells.
- **Fix:** "Own your community" (done in §3).

---

## 8. Summary of edits by page

| Page | Keep | Change | New |
|---|---|---|---|
| `/` | Hero H1, In Motion, OpenDoorCta | Eyebrow, subhead, creators card 03, chips, drop "keep 100%", **single CTA (fork removed)** | **Ladder section**, **Trust strip** |
| `/studios` | Quiet-leak, ROI calc, "Simple on purpose" | Concretize capabilities (rooms/staff), closing naming | (optional trust line) |
| `/features` | Free-core hero, "Coming" tags, promise 1/3/4 | Promise 02 (drop 0%), roadmap (live = Now via Meet/Zoom), **`/join`→`/signup`** | — |
| `/founding` | — | **RETIRED** — 301 → `/signup`, drop from sitemap, fix blog CTA | — |
| Chrome | Nav, footer links | (optional) add Trust to footer; "Own your movement" tagline stays | — |

**Nothing here has been applied to code.** On approval, these map cleanly onto the existing section blocks; the only structural additions are the homepage *Ladder* section and the *Trust & safety* strip.
