-- creator_waitlist: marketing-site waitlist for creators (Founding Studios are full).
-- The homepage waitlist form inserts here using the anon (public) Supabase key,
-- so RLS must allow anonymous INSERTs. Reads are NOT granted to anon.
-- Run this in the Supabase SQL editor for project jqmvznvbeueywvadexwd.

create table if not exists public.creator_waitlist (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  name              text,
  discipline        text,          -- answer to "What do you teach?"
  instagram_handle  text,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

alter table public.creator_waitlist enable row level security;

-- Allow anyone (anon + authenticated) to add themselves to the waitlist.
-- The unique constraint on email surfaces duplicates as error code 23505,
-- which the form handles gracefully ("You're already on the list").
drop policy if exists "Anyone can join the creator waitlist" on public.creator_waitlist;
create policy "Anyone can join the creator waitlist"
  on public.creator_waitlist
  for insert
  to anon, authenticated
  with check (true);

-- No select/update/delete policies: the public can insert but cannot read the list.
-- Manage entries via the Supabase dashboard or the service role.
