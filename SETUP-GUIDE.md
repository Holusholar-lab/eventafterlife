# Event Afterlife – Step-by-step setup guide

Follow these steps to run the app locally and deploy it to Vercel with Supabase as the database.

---

## Part 1: Supabase (database)

### Step 1: Create a Supabase project

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **“New project”**.
3. Choose your **organization** (or create one).
4. Fill in:
   - **Name:** e.g. `event-afterlife`
   - **Database password:** choose a strong password and **save it somewhere safe** (you need it for DB access later).
   - **Region:** pick the closest to your users.
5. Click **“Create new project”** and wait until it says **“Project is ready”** (1–2 minutes).

---

### Step 2: Create the database tables

1. In the left sidebar, click **“SQL Editor”**.
2. Click **“New query”**.
3. Open the file **`supabase/schema.sql`** in your project (in your code editor or Finder).
4. **Copy everything** in that file (Ctrl+A / Cmd+A, then Ctrl+C / Cmd+C).
5. **Paste** into the Supabase SQL Editor.
6. Click **“Run”** (or press Ctrl+Enter / Cmd+Enter).
7. You should see a success message. Your tables (`admin_videos`, `rentals`, `contact_messages`) are now created.

---

### Step 3: Get your Supabase API keys

1. In the left sidebar, click **“Settings”** (gear icon).
2. Click **“API”** in the left menu.
3. You’ll see:
   - **Project URL** – e.g. `https://abcdefgh.supabase.co`
   - **Project API keys** – find the one named **“anon” “public”**
4. Click the **copy** icon next to:
   - **Project URL** → paste it into a note (you’ll use it in the next part).
   - **anon public** key → paste it into the same note.

Keep this note open for the next part.

---

## Part 2: Run the app locally

### Step 4: Install dependencies and add env vars

1. Open a terminal and go to your project folder:
   ```bash
   cd /Users/mosesolufemi/Downloads/learn-rent-share-main
   ```
2. Install dependencies (if you haven’t already):
   ```bash
   npm install
   ```
3. Create a `.env` file in **the same folder** as `package.json`:
   - Copy `.env.example` and rename the copy to `.env`,  
   **or**
   - Create a new file named `.env` and paste this (then replace the placeholders with your real values):
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-full-anon-key
   ```
   Replace:
   - `YOUR-PROJECT-REF.supabase.co` with your **Project URL** from Step 3 (without `https://` if you already have it in the URL).
   - The long `eyJ...` string with your full **anon public** key from Step 3.
4. Save the file.

---

### Step 5: Run the app on your computer

1. In the terminal (still in the project folder), run:
   ```bash
   npm run dev
   ```
2. Open the URL it shows (usually **http://localhost:5173**) in your browser.
3. You should see the Event Afterlife site. Try:
   - **Sign up** (Create account).
   - Go to **Admin** (you must be logged in): **/admin**.
   - Add a video (Upload), then check the Library and Watch page.

If something doesn’t work, check that `.env` has no typos and that you ran the SQL in Step 2.

---

## Part 3: Deploy to Vercel with Supabase

### Step 6: Push your code to GitHub

1. In the terminal, from your project folder:
   ```bash
   git add .
   git commit -m "Add Supabase and setup guide"
   git push origin main
   ```
   (Use your usual branch name if it’s not `main`.)

---

### Step 7: Add env vars in Vercel

1. Go to **[vercel.com](https://vercel.com)** and open the project that’s linked to your GitHub repo (Event Afterlife).
2. Click the project name → **“Settings”**.
3. In the left menu, click **“Environment Variables”**.
4. Add two variables (one by one):

   **First variable**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** your Supabase Project URL (same as in your `.env`), e.g. `https://abcdefgh.supabase.co`
   - **Environment:** tick **Production** (and **Preview** if you want).
   - Click **“Save”**.

   **Second variable**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** your Supabase **anon public** key (the long string from Step 3).
   - **Environment:** tick **Production** (and **Preview** if you want).
   - Click **“Save”**.

5. (Optional) If you want only one admin account:
   - **Name:** `VITE_ADMIN_EMAIL`
   - **Value:** the email address that should be the only one allowed in the admin panel (e.g. `you@example.com`).

---

### Step 8: Redeploy so Vercel uses the new env vars

1. In Vercel, go to the **“Deployments”** tab.
2. Open the **⋮** menu on the latest deployment.
3. Click **“Redeploy”** and confirm.
4. Wait for the new deployment to finish (status “Ready”).
5. Open your live site URL (e.g. `https://your-project.vercel.app`). The app will now use Supabase in production too.

---

## Quick checklist

- [ ] Supabase project created  
- [ ] `supabase/schema.sql` run in SQL Editor  
- [ ] Project URL and anon key copied  
- [ ] `.env` created locally with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`  
- [ ] `npm run dev` works and you can sign up, log in, and use admin  
- [ ] Code pushed to GitHub  
- [ ] Same two env vars added in Vercel (and optional `VITE_ADMIN_EMAIL`)  
- [ ] Vercel project redeployed  

---

## If something goes wrong

- **“Loading…” forever:** Check the browser console (F12 → Console). Often it’s a wrong Supabase URL or key, or the SQL wasn’t run.
- **404 on /admin:** Make sure `vercel.json` exists in the project and you’ve pushed it (so Vercel does the SPA rewrite).
- **Videos / messages not saving:** Confirm both env vars are set in Vercel and you clicked **Redeploy** after adding them.

For more detail on Supabase only, see **`supabase/README.md`** in the project.
