-- Phase 0 skeleton: minimal profiles table + the verification-gate RLS invariant
-- (CLAUDE.md Invariant 1). Full profile/verification schema arrives in Phase 1;
-- this exists so the CI pipeline (db-migrations-check, rls-invariant-tests) has
-- something real to run against from day one.

create extension if not exists postgis with schema extensions;

create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null,
  verification_status verification_status not null default 'unverified',
  location geography(point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_location_idx on public.profiles using gist (location);

alter table public.profiles enable row level security;

-- Invariant 1: a profile is visible to another user only when verified.
-- The owner can always see their own row regardless of status.
create policy "profiles_select_verified_or_own"
  on public.profiles for select
  to authenticated
  using (verification_status = 'verified' or user_id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
