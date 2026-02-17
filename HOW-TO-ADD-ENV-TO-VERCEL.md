# How to Add Environment Variables to Vercel

## Step-by-Step Instructions with Screenshots Guide

---

## Step 1: Go to Your Vercel Project

1. Open your browser and go to: **https://vercel.com/dashboard**
2. **Sign in** if you're not already signed in
3. **Click on your project** (the one you just created/imported)

---

## Step 2: Navigate to Settings

1. Look at the **top menu bar** - you'll see tabs like:
   - Overview | Deployments | Analytics | Settings | etc.
2. **Click on "Settings"** (it's usually near the right side)

---

## Step 3: Find Environment Variables Section

1. In the Settings page, look at the **left sidebar menu**
2. You'll see options like:
   - General
   - **Environment Variables** ← Click this one!
   - Git
   - Domains
   - etc.

---

## Step 4: Add Your First Variable

1. You'll see a page with:
   - A search box at the top
   - A table showing existing variables (probably empty)
   - A button that says **"Add New"** or **"Add"** or **"Add Environment Variable"**

2. **Click the "Add New" button**

3. A form will appear with three fields:
   - **Key** (or Name)
   - **Value**
   - **Environment** (checkboxes for Production, Preview, Development)

---

## Step 5: Add Each Variable One by One

### Variable 1: VITE_ADMIN_EMAIL

1. In the **Key** field, type exactly: `VITE_ADMIN_EMAIL`
2. In the **Value** field, paste: `olufemiolushola8@gmail.com`
3. **Check ALL THREE boxes:**
   - ☑ Production
   - ☑ Preview  
   - ☑ Development
4. Click **"Save"** or **"Add"**

---

### Variable 2: VITE_SUPABASE_URL

1. Click **"Add New"** again
2. **Key:** `VITE_SUPABASE_URL`
3. **Value:** `https://upcvvwdlabgrvxkgkuow.supabase.co`
4. **Check all three boxes** (Production, Preview, Development)
5. Click **"Save"**

---

### Variable 3: VITE_SUPABASE_ANON_KEY

1. Click **"Add New"** again
2. **Key:** `VITE_SUPABASE_ANON_KEY`
3. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4`
4. **Check all three boxes**
5. Click **"Save"**

---

### Variable 4: VITE_BUNNY_LIBRARY_ID

1. Click **"Add New"** again
2. **Key:** `VITE_BUNNY_LIBRARY_ID`
3. **Value:** `601163`
4. **Check all three boxes**
5. Click **"Save"**

---

### Variable 5: VITE_BUNNY_CDN_HOST

1. Click **"Add New"** again
2. **Key:** `VITE_BUNNY_CDN_HOST`
3. **Value:** `https://event-afterlife-stream.b-cdn.net`
4. **Check all three boxes**
5. Click **"Save"**

---

### Variable 6: VITE_BUNNY_STREAM_API_KEY

1. Click **"Add New"** again
2. **Key:** `VITE_BUNNY_STREAM_API_KEY`
3. **Value:** `fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d`
4. **Check all three boxes**
5. Click **"Save"**

---

## Step 6: Verify All Variables Are Added

After adding all 6 variables, you should see a table/list showing:

```
VITE_ADMIN_EMAIL                    Production, Preview, Development
VITE_SUPABASE_URL                  Production, Preview, Development
VITE_SUPABASE_ANON_KEY             Production, Preview, Development
VITE_BUNNY_LIBRARY_ID              Production, Preview, Development
VITE_BUNNY_CDN_HOST                Production, Preview, Development
VITE_BUNNY_STREAM_API_KEY          Production, Preview, Development
```

---

## Step 7: Redeploy Your Site

1. Go to the **"Deployments"** tab (top menu)
2. Find your latest deployment
3. Click the **"..."** (three dots) menu on the right
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again
6. **Wait 1-2 minutes** for the deployment to finish

---

## ✅ You're Done!

Your environment variables are now configured! Your site should work correctly after redeployment.

---

## Quick Copy-Paste Reference

**Copy these values directly from your .env file:**

```
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
```

**Remember:** 
- Copy ONLY the value part (after the `=`)
- The Key is everything before the `=` (without the `VITE_` prefix? No wait, include `VITE_`!)
- Actually, copy the full variable name including `VITE_`

---

## Troubleshooting

### Can't find "Environment Variables"?
- Make sure you're in the **Settings** page
- Look in the **left sidebar**, not the top menu

### Variables not saving?
- Make sure you checked at least one environment (Production, Preview, or Development)
- Try refreshing the page and adding again

### Site still not working after adding variables?
- Make sure you **redeployed** after adding variables
- Check that all 6 variables are present
- Verify the values are correct (no extra spaces)

---

**That's it! Follow these steps and your environment variables will be configured correctly! 🎉**
