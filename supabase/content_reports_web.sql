-- Extend content_reports to accept public / anonymous reports submitted from the
-- website (the /report page + inline "Report" affordances). Existing app reports
-- are unaffected. Run in the Supabase SQL editor (production jqmvznvbeueywvadexwd).
--
-- Web reports are inserted by the /api/report route using the SERVICE ROLE key,
-- so they bypass RLS — no public INSERT policy is added (keeps the table
-- unreadable/uninsertable by anon clients directly). The admin console reads
-- these rows exactly as it reads app reports.

-- 1. New columns (all nullable / defaulted so existing rows and the app are fine).
alter table public.content_reports
  add column if not exists reporter_email   text,           -- optional; web reporters may leave one
  add column if not exists report_source    text not null default 'app',  -- 'app' | 'web'
  add column if not exists subject_url       text,           -- the URL being reported (web)
  add column if not exists subject_username  text;           -- the @handle being reported (web)

-- 2. Web reports are anonymous by default — reporter_id must allow NULL.
--    (No-op if it is already nullable.)
alter table public.content_reports
  alter column reporter_id drop not null;

-- 3. Helpful for the admin queue: quickly find fresh web reports.
create index if not exists content_reports_source_status_idx
  on public.content_reports (report_source, status, created_at desc);

-- Column recap for reference (existing + new):
--   reason           text     -- category: sexual_content | minor_safety | violence |
--                             --           hate | spam_misleading | copyright | other
--   details          text     -- free-text description from the reporter
--   report_type      text     -- 'web' for website reports (app uses content_item/post/user)
--   status           text     -- 'pending' (default for new) | 'reviewed' | 'actioned'
--   report_source    text     -- 'web' for these
--   subject_url      text
--   subject_username text
--   reporter_email   text
--   reporter_id      uuid null -- null for anonymous web reports
