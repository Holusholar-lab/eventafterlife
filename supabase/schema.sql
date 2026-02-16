-- Run this in your Supabase project: SQL Editor → New query → paste and run.

-- Admin videos (same shape as app)
create table if not exists public.admin_videos (
  id text primary key,
  title text not null,
  description text not null,
  video_url text not null default '',
  thumbnail_url text not null default '',
  category text not null default '',
  duration text not null default '0 min',
  price_24h numeric not null default 0,
  price_48h numeric not null default 0,
  price_72h numeric not null default 0,
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at bigint not null,
  updated_at bigint not null,
  views int not null default 0,
  rentals int not null default 0,
  revenue numeric not null default 0
);

-- Rentals (per user/browser)
create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  user_id text,
  plan text not null check (plan in ('24', '48', '72')),
  rented_at bigint not null,
  expires_at bigint not null,
  price_paid numeric not null default 0
);

create index if not exists rentals_video_id on public.rentals(video_id);
create index if not exists rentals_expires_at on public.rentals(expires_at);

-- Contact form messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at bigint not null
);

-- Allow anonymous read/write for now (restrict with RLS later when you add Supabase Auth)
alter table public.admin_videos enable row level security;
alter table public.rentals enable row level security;
alter table public.contact_messages enable row level security;

create policy "Allow all for admin_videos" on public.admin_videos for all using (true) with check (true);
create policy "Allow all for rentals" on public.rentals for all using (true) with check (true);
create policy "Allow all for contact_messages" on public.contact_messages for all using (true) with check (true);
