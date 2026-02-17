# Step-by-Step Deployment Guide

Follow these steps **in order** to deploy your website to production.

---

## ✅ STEP 1: Push Code to GitHub

**Your code is already committed!** Now push it:

```bash
git push origin main
```

**What this does:** Uploads your code to GitHub so Vercel can access it.

---

## ✅ STEP 2: Connect GitHub to Vercel

1. **Open your browser** and go to: https://vercel.com/dashboard

2. **Sign in** with your GitHub account (or create a Vercel account)

3. Click the **"Add New Project"** button (big button, usually top right)

4. You'll see a list of your GitHub repositories. **Find and click** on your repository:
   - Repository name should be something like `eventafterlife` or `learn-rent-share-main`

5. Vercel will auto-detect it's a Vite project. **Click "Deploy"** (don't worry about settings yet)

6. **Wait for the first deployment** to finish (this will fail because we haven't added environment variables yet - that's OK!)

---

## ✅ STEP 3: Add Environment Variables in Vercel

**This is CRITICAL - your site won't work without these!**

1. In your Vercel project dashboard, click **"Settings"** (top menu)

2. Click **"Environment Variables"** (left sidebar)

3. **Add each variable one by one** using the "Add New" button:

   **Variable 1:**
   - **Name:** `VITE_ADMIN_EMAIL`
   - **Value:** `olufemiolushola8@gmail.com`
   - **Environment:** Check all three boxes (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://upcvvwdlabgrvxkgkuow.supabase.co`
   - **Environment:** Check all three boxes
   - Click "Save"

   **Variable 3:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4`
   - **Environment:** Check all three boxes
   - Click "Save"

   **Variable 4:**
   - **Name:** `VITE_BUNNY_LIBRARY_ID`
   - **Value:** `601163`
   - **Environment:** Check all three boxes
   - Click "Save"

   **Variable 5:**
   - **Name:** `VITE_BUNNY_CDN_HOST`
   - **Value:** `https://event-afterlife-stream.b-cdn.net`
   - **Environment:** Check all three boxes
   - Click "Save"

   **Variable 6:**
   - **Name:** `VITE_BUNNY_STREAM_API_KEY`
   - **Value:** `fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d`
   - **Environment:** Check all three boxes
   - Click "Save"

4. **After adding all variables**, go to the **"Deployments"** tab (top menu)

5. Find the latest deployment and click the **"..."** menu → **"Redeploy"**

6. **Wait for deployment to finish** (should take 1-2 minutes)

---

## ✅ STEP 4: Get Your Vercel Domain

1. After deployment succeeds, you'll see your site URL at the top of the deployment page
2. It will look like: `https://your-project-name.vercel.app`
3. **Copy this URL** - you'll need it for the next step!

---

## ✅ STEP 5: Configure Bunny.net Allowed Domains

**This allows videos to play on your deployed site!**

1. Go to: https://bunny.net/dashboard

2. Navigate to: **Stream** → **Your Library** (Library ID: 601163)

3. Click on **"Security"** (or "Settings" → "Security")

4. Find the **"Allowed Domains"** section

5. **Add these domains** (one per line):
   ```
   your-project-name.vercel.app
   *.vercel.app
   ```
   *(Replace `your-project-name` with your actual Vercel project name)*

6. Click **"Save"** or **"Update"**

---

## ✅ STEP 6: Test Your Deployed Site

1. **Open your site** in a browser: `https://your-project-name.vercel.app`

2. **Test public features:**
   - ✅ Homepage loads
   - ✅ Can browse library
   - ✅ Videos play (if you have videos added)

3. **Test admin access:**
   - Click "Sign In" or "Get Started"
   - **Sign up** with email: `olufemiolushola8@gmail.com` (or log in if you already have an account)
   - Navigate to: `https://your-project-name.vercel.app/admin`
   - ✅ You should see the admin dashboard
   - ✅ Try adding/editing a video

---

## ✅ STEP 7: Verify Everything Works

**Checklist:**

- [ ] Site loads without errors
- [ ] Can sign up/login
- [ ] Can access `/admin` with your admin email
- [ ] Videos play correctly (if you have videos)
- [ ] Can add/edit videos from admin panel
- [ ] Changes save correctly (check Supabase dashboard)

---

## 🎉 You're Done!

**Your site is now live!** Here's how to make changes:

### Making Code Changes:
```bash
# Edit files locally
git add .
git commit -m "Your change description"
git push origin main
# Vercel will auto-deploy!
```

### Making Content Changes:
1. Log in to your live site
2. Go to `/admin`
3. Add/edit videos
4. Changes save to Supabase immediately (affects all users)

---

## 🆘 Troubleshooting

### Videos Not Playing?
- Go back to Bunny.net → Security → Allowed Domains
- Make sure your Vercel domain is added
- Wait 1-2 minutes for changes to propagate

### Can't Access Admin?
- Make sure you're logged in
- Verify `VITE_ADMIN_EMAIL` in Vercel matches your login email exactly
- Check email is: `olufemiolushola8@gmail.com`

### Site Shows Errors?
- Check Vercel deployment logs (click on the deployment → "Logs" tab)
- Verify all environment variables are set correctly
- Make sure Supabase tables exist (run `supabase/schema.sql` if needed)

### Need Help?
- Check `DEPLOYMENT.md` for detailed information
- Check Vercel deployment logs for specific errors

---

**That's it! Follow these steps and your site will be live! 🚀**
