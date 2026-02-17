# Where is my data stored? (Offline vs online)

When you use the app **not on localhost** (e.g. on your **phone** or **PC** at `eventafterlife.vercel.app`), data is stored like this:

---

## It depends on one thing: Supabase env vars in the **deployed** app

When you deploy (e.g. to Vercel), the build bakes in env vars. So:

| Env vars in deployment | Where data is stored (phone, PC, any device) |
|------------------------|-----------------------------------------------|
| **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY** are set (e.g. in Vercel) | **Online** – Supabase cloud. All devices see the same videos, users, etc. |
| **Not** set (or missing in production) | **Offline** – each device’s **localStorage**. Phone has its own data, PC has its own. Nothing is shared. |

So:

- **Online** = Supabase (cloud). One source of truth for everyone.
- **Offline** = localStorage (inside each browser). Different per device, not synced.

---

## What goes where

| Data | If Supabase configured (online) | If Supabase not configured (offline) |
|------|---------------------------------|--------------------------------------|
| **Videos** (Library, Admin) | Stored in Supabase table `admin_videos` | Stored in browser **localStorage** (key `admin_videos`) |
| **Users / login** | Stored in Supabase tables `users` + `user_sessions` | Stored in browser **localStorage** |
| **Rentals** | Can use Supabase `rentals` table | Stored in browser **localStorage** |
| **Contact messages** | Can use Supabase | Stored in browser **localStorage** |

---

## How to know for your deployed site

1. Open your **deployed** site (e.g. `https://eventafterlife.vercel.app`) on a device.
2. If **phone and PC show the same videos** (after you’ve added them with Supabase set up), your data is **online** (Supabase).
3. If **phone shows different videos than PC**, data is **offline** (localStorage) on that deployment – usually because **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY** are **not** set in that host’s environment (e.g. Vercel → Project → Settings → Environment Variables).

---

## To have data **online** (same on phone, PC, localhost)

1. In **Supabase**: create the tables (`admin_videos`, and optionally `users`, `user_sessions`) – see `supabase/schema.sql` and `supabase/users-table.sql`.
2. In your **host** (e.g. Vercel): add **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY** for **Production** (and Preview if you want).  
   - **Important:** If they are only set for **Preview**, your **production** site (e.g. eventafterlife.vercel.app) will not have them, so production will use offline localStorage and each device will see different data. Set Supabase vars for **Production** or **All Environments**.
3. Redeploy after changing env vars. Then the deployed app uses Supabase = **data is online** for everyone.

**Summary:**  
- **Localhost** can use its own `.env`; that doesn’t affect the deployed site.  
- **Phone / PC** (deployed app): data is **online** (Supabase) only if those two env vars are set in the deployment; otherwise it’s **offline** (localStorage per device).
