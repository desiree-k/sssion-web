# CLAUDE.md — Sssion Web (Next.js)

Read before editing. This is production — Vercel auto-deploys every push to main.

## Ground rules
- **This clone (~/code/sssion-web-clone) is the active working copy.** ~/Documents/sssion-web is an older checkout with macOS permission issues; do not build from it without checking with the founder.
- Nonstandard/new Next.js version — read the bundled docs before using APIs (params are Promises: `await params`).
- Founder is non-technical: plain explanations, flag risks, never push without her preview approval unless she says "push."
- Supabase project jqmvznvbeueywvadexwd (production, no staging). SQL is run by the founder in the dashboard SQL editor — output .sql files, don't attempt CLI/service-role access.

## Site map
- `/` homepage — creator CTAs point to `#waitlist` (CreatorWaitlist component → `creator_waitlist` table). Open creator signup is CLOSED; `/join` still works for invite codes only.
- `/founding` — social proof + "Founding Studios are full" banner → waitlist
- `/features`, `/blog` (MDX in content/blog/, plain text only — RTF files silently fail), `/discover`, `/privacy`, `/terms`
- `/[username]` — THE creator profile page (see below)
- `/embed/[username]` — iframe follow widget
- `/student/*` — member web experience; `/auth/*` (password recovery redirects straight to /reset-password — do not reroute through /auth/callback, there's a token race); `/admin`; `/unsubscribe` (flag-based via SECURITY DEFINER RPC — never delete rows)
- `public/.well-known/assetlinks.json` — Android App Links (fingerprint still pending)

## The profile page (app/[username]/page.tsx)
- **Editorial theme system** — lib/profileThemes.ts, two themes (ivory/noir) × 3 accents each, resolved server-side from `creators.profile_theme` + `theme_accent`, rendered via `--pt-*` CSS variables. Fraunces masthead (stacked name), video in true-black wells, ink/ivory primary buttons, accent for details only. **Never use creators.accent_color here** (that's app-only).
- **community_enabled** (boolean) replaced space_mode: true → offerings/Join hero, "Stay Updated" demoted to quiet secondary; false → Stay Updated primary, no join CTAs. Legacy string values may linger in old rows — treat anything except explicit false as enabled.
- Access check is dual: `studio_access` (legacy, approved) OR `member_offerings` (active). Members see "Enter Space."
- Email-only follow: insert into `email_followers` with consent_text + consent_source; duplicates → friendly "already following."
- Reviewer names come from `profiles.full_name` — display_name does not exist on profiles.
- getCreatorByUsernameOrId: UUID-regex guard before the id fallback (bots probe /robots.txt etc. through this catch-all).

## Data traps
- `community_posts.studio_id` is the creator FK (not creator_id)
- Payments detection must include legacy columns (cashapp_username, paypal_username…) AND payment_links jsonb
- Web gates content via `is_preview` in some legacy spots; the app uses content_type/visibility — don't "unify" casually
- Supabase update() without .select() lies about success — always verify writes

## Copyright/compliance
- Every marketing email: unsubscribe link + physical address in footer (CAN-SPAM). The unsubscribe page is canonical at sssion.studio/unsubscribe.
- Digest/broadcast senders filter email_followers on unsubscribed = false.

## Design direction
- Marketing pages: currently dark; an Ivory Editorial video-first redesign is specced (sssion_ivory_editorial_addendum) but not built.
- Rose gold #B76E79 is the app brand accent; the profile themes deliberately do NOT use it. Never introduce #E84393 hot pink as chrome.
- No stock generic fitness imagery. No pricing tables.

## Deploy
- npm run build must pass before push; push to main = live within ~2 min
- domains: sssion.studio primary; sssion.com / .space redirect (301) at Vercel
