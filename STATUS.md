# Where We Stopped – What Works & What Doesn’t

Quick reference for the current state of the **Event Afterlife** app.

---

## What works

### App & build
- **React front end** (Vite + React 18 + TypeScript) runs and builds (`npm run build` succeeds).
- **Routing**: Home, Library, Watch, Login, Sign Up, Profile, Contact, Support, Community, Admin, etc.
- **Auth**: Sign up, login, logout. Profile page with logout. Admin access gated by `VITE_ADMIN_EMAIL`.

### Admin panel
- **Dashboard**, **Users**, **Videos** (list/edit), **Upload**, **Categories**, **Hosts**, **Commissions**, **Payments**, **Subscriptions**, **Forums**, **Comments**, **Newsletter**, **Messages**, **Analytics**, **Settings**.
- **Mobile**: Admin layout is responsive (sidebar, tables, forms).
- **Upload flow**: Add video with Bunny URL or upload to Bunny; saves to Supabase when configured.

### Public site
- **Library** and **Home** list public videos (from Supabase or localStorage).
- **Watch** page: rental flow, video player (YouTube, Vimeo, direct MP4, Bunny embed).
- **Video player**: Bunny uses **embed iframe first**; direct MP4 as fallback. URL parser supports `/embed/` and `/play/` Bunny links.

### Data & sync (when configured)
- **Videos**: Stored in Supabase `admin_videos`; Library/Home refetch every 30s so new uploads show for everyone.
- **Auth/sync**: If Supabase `users` and `user_sessions` tables exist, login/signup use Supabase so the same account works across devices.

---

## What doesn’t work (or needs your action)

### 1. Bunny video won’t play
- **Cause**: Your site’s domain is not in Bunny’s **Allowed domains**.
- **Fix**:  
  Bunny Dashboard → **Stream** → your library → **Security** → **Allowed domains**  
  Add: `eventafterlife.vercel.app`, `localhost` (if you test locally), and optionally `*.vercel.app`.  
  Save, wait ~1 minute, hard refresh (Ctrl+Shift+R) or try incognito.
- **Details**: `BUNNY-PLAYBACK-FIX.md`

### 2. Videos don’t show on Library (for you or others)
- **Possible causes**  
  - Video is not **Public**: in Admin, category must be **“Public”** (or the video’s “public” setting on).  
  - Supabase not used: without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, videos are only in the current device’s localStorage, so other users/devices won’t see them.
- **Fix**  
  - Set Supabase env vars and ensure `admin_videos` table exists (`supabase/schema.sql`).  
  - When adding/editing a video, set category to **Public** if it should appear on the Library.

### 3. Cross-device login / “admin activity not synced”
- **Cause**: Cross-device auth needs Supabase `users` and `user_sessions` tables.
- **Fix**: In Supabase **SQL Editor**, run the script in `supabase/users-table.sql` to create those tables.  
  Then sign up (or log in) again; that account will work on any device.
- **Details**: `CROSS-DEVICE-SYNC-SETUP.md`

### 4. Admin uploads not visible to “everybody”
- **Works when**: Supabase is configured and the video is **Public**.  
  Then: upload in Admin → saved to Supabase → Library/Home refetch every 30s → everyone sees it (after refresh or within ~30s).
- **If not**: Check Supabase env vars and that the video is Public; see `ADMIN-PUSH-TO-PLATFORM.md`.

---

## One-time setup checklist

| Step | Action | Doc / file |
|------|--------|------------|
| 1 | Create Supabase `admin_videos` table | `supabase/schema.sql` |
| 2 | Create Supabase `users` + `user_sessions` (for cross-device auth) | `supabase/users-table.sql` |
| 3 | Add site domain in Bunny Stream → Security → Allowed domains | `BUNNY-PLAYBACK-FIX.md` |
| 4 | Set `.env` (and Vercel env): `VITE_SUPABASE_*`, `VITE_BUNNY_*`, `VITE_ADMIN_EMAIL` | `HOW-TO-ADD-ENV-TO-VERCEL.md` |
| 5 | When adding a video, set category **Public** so it appears on Library | Admin → Upload / Edit video |

---

## Docs in this repo

- **BUNNY-PLAYBACK-FIX.md** – Video won’t play (Bunny Allowed domains, URL format).
- **ADMIN-PUSH-TO-PLATFORM.md** – Admin uploads visible to everyone (Supabase + Public).
- **CROSS-DEVICE-SYNC-SETUP.md** – Same account on all devices (users + sessions in Supabase).
- **DEPLOYMENT.md** / **STEP-BY-STEP-DEPLOYMENT.md** – Deploy to Vercel, env vars, GitHub.

---

## Summary

- **Codebase**: Build passes; React app, admin, and public flows are implemented.
- **Playback**: Works once Bunny Allowed domains are set and video URL is correct.
- **Visibility**: Works when Supabase is set up, `admin_videos` exists, and videos are **Public**.
- **Cross-device**: Works after `users` and `user_sessions` are created in Supabase and env is set.

If something still doesn’t work, say which part (e.g. “Bunny still won’t play” or “videos still don’t show on Library”) and we can narrow it down.
