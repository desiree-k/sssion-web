-- Open Door step 3: admin freeze notes.
-- Run BEFORE using the Freeze toggle in /admin — the freeze action writes
-- this column and will error without it. (Freezing itself uses
-- creators.is_frozen from step 1.)

alter table creators
  add column if not exists admin_note text;
