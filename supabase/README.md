# Supabase setup for Event Afterlife

## 1. Create a project

In [Supabase Dashboard](https://supabase.com/dashboard), create a new project and wait for it to be ready.

## 2. Run the schema

1. In your project, open **SQL Editor** → **New query**.
2. Copy the contents of `schema.sql` in this folder and paste into the editor.
3. Click **Run**. This creates the tables and policies.

## 3. Get your API keys

1. Go to **Settings** → **API** in the Supabase project.
2. Copy:
   - **Project URL** → use as `VITE_SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY`

## 4. Configure the app

**Local:** Create a `.env` file in the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Vercel:** In your Vercel project → **Settings** → **Environment Variables**, add the same two variables for Production (and Preview if you want).

## 5. Restart / redeploy

- Local: restart the dev server (`npm run dev`).
- Vercel: trigger a new deployment (e.g. push a commit).

Once these env vars are set, the app will use Supabase for:

- **Admin videos** – stored in `admin_videos`
- **Rentals** – stored in `rentals` (per user when logged in)
- **Contact messages** – stored in `contact_messages`

If the env vars are not set, the app keeps using **localStorage** as before.
