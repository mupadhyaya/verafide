-- Invariant 1 (CLAUDE.md): an unverified profile must never be returned to
-- another user by any query. This is the CI-enforced form of that promise —
-- any PR touching profiles RLS must keep this passing (see .github/CODEOWNERS).

begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

-- Fixture users (direct insert is fine for test fixtures; real signups go
-- through Supabase Auth, not this path).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'viewer@test.local'),
  ('00000000-0000-0000-0000-000000000002', 'verified@test.local'),
  ('00000000-0000-0000-0000-000000000003', 'unverified@test.local');

insert into public.profiles (user_id, display_name, verification_status) values
  ('00000000-0000-0000-0000-000000000001', 'Viewer', 'verified'),
  ('00000000-0000-0000-0000-000000000002', 'Verified Person', 'verified'),
  ('00000000-0000-0000-0000-000000000003', 'Unverified Person', 'unverified');

-- Act as the "viewer" user via RLS.
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

select isnt_empty(
  $$ select 1 from public.profiles where display_name = 'Verified Person' $$,
  'a verified profile IS visible to another authenticated user'
);

select is_empty(
  $$ select 1 from public.profiles where display_name = 'Unverified Person' $$,
  'an unverified profile is NEVER visible to another authenticated user'
);

select isnt_empty(
  $$ select 1 from public.profiles where display_name = 'Viewer' $$,
  'a user can always see their own profile regardless of verification_status'
);

select * from finish();
rollback;
