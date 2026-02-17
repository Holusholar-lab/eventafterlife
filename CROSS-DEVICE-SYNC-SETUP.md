# Cross-Device Sync Setup Guide

This guide will help you set up cross-device synchronization so that admin activity and user data syncs across all devices.

## What This Enables

✅ **Cross-device login**: Log in on any device and access your account  
✅ **Synced admin data**: Videos, users, and settings sync across devices  
✅ **Real-time updates**: Changes made on one device appear on all devices  
✅ **Persistent sessions**: Stay logged in across devices for 30 days  

## Prerequisites

- Supabase project configured (you should already have this)
- `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Step 1: Create Users Table in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** → **New query**
3. Copy and paste the contents of `supabase/users-table.sql`
4. Click **Run** to execute the SQL

This creates:
- `users` table: Stores user accounts (email, password hash, newsletter preference)
- `user_sessions` table: Stores login sessions for cross-device access

## Step 2: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. You should see:
   - `users` table
   - `user_sessions` table

## Step 3: Test Cross-Device Sync

1. **On Device 1** (e.g., your computer):
   - Sign up or log in to your admin account
   - Upload a video or make changes

2. **On Device 2** (e.g., your phone):
   - Log in with the same email/password
   - You should see:
     - Your uploaded videos
     - Your admin settings
     - All synced data

## How It Works

### Authentication Flow

1. **Sign Up**: Creates user in Supabase `users` table + creates session in `user_sessions`
2. **Login**: Verifies credentials from Supabase, creates session token
3. **Session**: Token stored in localStorage + Supabase for cross-device verification
4. **Logout**: Removes session from both localStorage and Supabase

### Data Sync

- **Videos**: Already synced via Supabase `admin_videos` table
- **Users**: Now synced via Supabase `users` table
- **Sessions**: Synced via Supabase `user_sessions` table

### Fallback Behavior

If Supabase is not configured or unavailable:
- System falls back to localStorage (device-specific)
- Data won't sync across devices
- All features still work locally

## Troubleshooting

### "Email already registered" but can't log in

- Check if user exists in Supabase `users` table
- Password might be different - try resetting or creating new account

### Not syncing across devices

1. Verify Supabase tables are created (`users` and `user_sessions`)
2. Check `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Check browser console for errors
4. Verify you're using the same email/password on both devices

### Session expired

- Sessions expire after 30 days
- Simply log in again to create a new session

## Security Notes

⚠️ **Current Implementation**: Uses Base64 encoding for passwords (NOT secure)  
✅ **Production Ready**: Replace with proper password hashing (bcrypt, argon2) before production use

## Migration from localStorage

Existing users in localStorage will:
- Continue to work locally
- Need to sign up again to sync across devices
- Or manually migrate data to Supabase (advanced)

## Next Steps

1. ✅ Run the SQL script to create tables
2. ✅ Test login on multiple devices
3. ✅ Verify data syncs correctly
4. ⚠️ Consider implementing proper password hashing for production
