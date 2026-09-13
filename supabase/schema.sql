-- SignPaham — Supabase schema
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run

-- ============================================================
-- 1. profiles
--    Extends auth.users with the app-specific fields we collect
--    at registration (first name / last name). One row per user.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
-- Expects first_name / last_name to be passed as user metadata
-- during supabase.auth.signUp({ options: { data: { first_name, last_name } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. quiz_history
--    One row per answered word in Latihan mode.
-- ============================================================
create table if not exists public.quiz_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  kesulitan text not null check (kesulitan in ('mudah', 'sedang', 'sulit')),
  kecepatan text not null check (kecepatan in ('lambat', 'cepat')),
  correct boolean not null,
  user_answer text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists quiz_history_user_id_created_at_idx
  on public.quiz_history (user_id, created_at desc);

alter table public.quiz_history enable row level security;

create policy "Quiz history is viewable by owner"
  on public.quiz_history for select
  using (auth.uid() = user_id);

create policy "Quiz history is insertable by owner"
  on public.quiz_history for insert
  with check (auth.uid() = user_id);

create policy "Quiz history is deletable by owner"
  on public.quiz_history for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 3. huruf_progress
--    Tracks which BISINDO letters a user has opened/learned.
-- ============================================================
create table if not exists public.huruf_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  huruf text not null,
  viewed_at timestamptz not null default now(),
  primary key (user_id, huruf)
);

alter table public.huruf_progress enable row level security;

create policy "Huruf progress is viewable by owner"
  on public.huruf_progress for select
  using (auth.uid() = user_id);

create policy "Huruf progress is insertable by owner"
  on public.huruf_progress for insert
  with check (auth.uid() = user_id);

create policy "Huruf progress is updatable by owner"
  on public.huruf_progress for update
  using (auth.uid() = user_id);
