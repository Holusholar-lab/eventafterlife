-- Create users table for cross-device sync
-- Run this in Supabase: SQL Editor → New query → paste and run

create table if not exists public.users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  password_hash text not null, -- Store hashed password (implement hashing in app)
  newsletter boolean not null default false,
  created_at bigint not null,
  updated_at bigint not null default extract(epoch from now())::bigint * 1000
);

create index if not exists users_email on public.users(email);

-- Enable RLS
alter table public.users enable row level security;

-- Allow all for now (restrict later with proper auth)
create policy "Allow all for users" on public.users for all using (true) with check (true);

-- Session table for cross-device login
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  token text not null unique,
  expires_at bigint not null,
  created_at bigint not null,
  device_info text,
  ip_address text
);

create index if not exists sessions_user_id on public.user_sessions(user_id);
create index if not exists sessions_token on public.user_sessions(token);
create index if not exists sessions_expires_at on public.user_sessions(expires_at);

-- Enable RLS
alter table public.user_sessions enable row level security;

-- Allow all for now
create policy "Allow all for sessions" on public.user_sessions for all using (true) with check (true);
