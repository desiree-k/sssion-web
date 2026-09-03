-- Open Door step 4b: publish review queue.
-- Run BEFORE using the new Publish Queue tab in /admin.
--
-- space_status itself was added in step 1. These columns hold the
-- creator's publish application (set by the app when they apply) and
-- the admin's review decision (written by the queue's Approve/Decline).
-- The app-side apply flow should write publish_requested_at + publish_note
-- when it sets space_status = 'pending'.

alter table creators
  add column if not exists publish_requested_at timestamptz,
  add column if not exists publish_note text,
  add column if not exists publish_reviewed_at timestamptz,
  add column if not exists publish_review_note text;
