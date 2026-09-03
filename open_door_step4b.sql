-- Open Door step 4b: admin publish review queue.
-- Run BEFORE using the new Publish Queue tab in /admin.
--
-- The application columns (publish_applied_at, publish_application_note,
-- publish_review_note) are defined by the app repo's open_door_step4a.sql;
-- they're repeated here idempotently so the queue works whichever runs
-- first. publish_reviewed_at is new in 4b — stamped by Approve/Decline.
-- Approve deliberately leaves publish_applied_at set: the app's one-time
-- publish celebration keys off it.

alter table creators
  add column if not exists publish_applied_at timestamptz,
  add column if not exists publish_application_note text,
  add column if not exists publish_review_note text,
  add column if not exists publish_reviewed_at timestamptz;
