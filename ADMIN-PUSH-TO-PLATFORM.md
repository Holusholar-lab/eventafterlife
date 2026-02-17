# Admin uploads → visible to everyone

When you upload (or edit/delete) from the admin panel, those changes are the **source of truth** and should appear for all users on all devices. Here’s how it works and what you need.

## What you need

- **Supabase** must be configured (same project you use for the app).
- In `.env` (and in Vercel env vars if you deploy):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- The **admin_videos** table must exist in that Supabase project (see `supabase/schema.sql`).

If Supabase is not set up, uploads are stored only in the **current device’s browser** (localStorage) and **do not** appear for other users or devices.

## How it works

1. **You upload (or edit/delete) in the admin panel**
   - The app writes to Supabase `admin_videos`.
   - That database is the single source of truth for the platform.

2. **New visitors**
   - On first load, the app fetches the latest videos from Supabase.
   - They see whatever is currently in `admin_videos` (including your latest uploads).

3. **Users already on the site**
   - Library and Home refetch the list from Supabase every **30 seconds**.
   - So new uploads (and edits/deletes) show up for everyone within about 30 seconds, without a full page refresh.

4. **Direct links to a new video**
   - If someone opens a link to a video you just added, the Watch page refetches from Supabase when the video isn’t in cache, then shows it (or “Video not found” if it really doesn’t exist).

## Summary

- **Upload from admin** → saved to Supabase.
- **Everyone** (all devices) reads from the same Supabase data.
- **No extra “publish” step** — as soon as the upload succeeds, that video is live for the platform; users see it on next load or within ~30 seconds if they’re already on Library/Home.

## If you don’t see new videos

1. Confirm Supabase is configured and the `admin_videos` table exists.
2. Confirm the video is **Public** (category “Public” or the public checkbox, depending on your form).
3. Wait up to ~30 seconds on Library/Home, or refresh the page.
4. Check Supabase Table Editor: the row for that video should be in `admin_videos`.
