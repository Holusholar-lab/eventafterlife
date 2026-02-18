# ⚠️ SUPABASE SETUP REQUIRED

## The Issue

You're seeing 404 errors because the `user_sessions` table doesn't exist in your Supabase database. This causes:
- Login to work but user not being detected
- Profile icon not showing
- Community page redirecting to login

## Quick Fix: Create the Tables

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (the one with URL `upcvvwdlabgrvxkgkuow.supabase.co`)
3. **Go to SQL Editor** (left sidebar)
4. **Click "New query"**
5. **Copy and paste this SQL**:

```sql
-- Create users table for cross-device sync
create table if not exists public.users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  password_hash text not null,
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
```

6. **Click "Run"** (or press Cmd/Ctrl + Enter)
7. **Verify tables created**: Go to "Table Editor" → You should see `users` and `user_sessions` tables

## After Creating Tables

1. **Refresh your website**
2. **Log out and log back in** (this will create a proper session)
3. **Profile icon should appear**
4. **Community page should work**

## Temporary Workaround (Without Supabase Tables)

The code now falls back to localStorage-only mode if Supabase tables don't exist. However, for best results, **create the tables** as shown above.

## Need Help?

If you see any errors when running the SQL, make sure:
- You're in the correct Supabase project
- You have the right permissions
- The SQL syntax is correct (copy exactly as shown)
