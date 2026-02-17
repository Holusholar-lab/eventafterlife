# Bulk Import Environment Variables to Vercel

## ✅ YES! You Can Paste Your Entire .env File!

Vercel supports bulk import, which is **much faster** than adding variables one by one.

---

## Method 1: Bulk Import (FASTEST - Recommended!)

### Step 1: Prepare Your .env Content

Copy your entire `.env` file content (excluding comments):

```
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4
```

### Step 2: Go to Vercel Environment Variables

1. Go to: **https://vercel.com/dashboard**
2. Click your project
3. Go to **Settings** → **Environment Variables**

### Step 3: Use Bulk Import

1. Look for a button that says:
   - **"Import"** or
   - **"Bulk Import"** or
   - **"Add Multiple"** or
   - A button with an upload/import icon

2. **If you see an "Import" button:**
   - Click it
   - Paste your entire `.env` content
   - Select environments (Production, Preview, Development)
   - Click "Import" or "Save"

3. **If you DON'T see an Import button:**
   - Look for a text area or "Add Multiple" option
   - Some Vercel versions have a text box where you can paste multiple variables

### Step 4: Set Environments for All Variables

After importing, you may need to:
- Select all variables
- Set them to apply to: **Production, Preview, Development**

---

## Method 2: Manual Paste (If Bulk Import Not Available)

If Vercel doesn't have bulk import, you can still copy-paste quickly:

### Copy This Ready-to-Paste Format:

```
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4
```

Then add each line one by one (still faster than typing).

---

## Method 3: Vercel CLI (Advanced - Optional)

If you have Vercel CLI installed:

```bash
vercel env add VITE_ADMIN_EMAIL production preview development
# Paste: olufemiolushola8@gmail.com

vercel env add VITE_SUPABASE_URL production preview development
# Paste: https://upcvvwdlabgrvxkgkuow.supabase.co

# ... repeat for all variables
```

---

## ✅ What to Copy from Your .env File

**Copy ONLY the lines that start with `VITE_`** (skip comments):

✅ Copy these:
```
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4
```

❌ Don't copy these (comments):
```
# Admin – only this email can access /admin
# Bunny.net Stream – video hosting
# Pull Zone URL for direct MP4 playback
# Optional: for admin upload to Bunny
# Supabase – replace the values below
```

---

## Quick Steps Summary:

1. **Open your `.env` file**
2. **Copy all lines** (or just the `VITE_*` lines)
3. **Go to Vercel** → Your Project → Settings → Environment Variables
4. **Look for "Import" or "Bulk Import" button**
5. **Paste your content**
6. **Set environments** to Production, Preview, Development
7. **Save/Import**
8. **Redeploy**

---

## Important Notes:

⚠️ **Remove comments** - Vercel may not parse lines starting with `#`

⚠️ **Format matters** - Make sure it's `KEY=value` format (one per line)

⚠️ **Set environments** - After importing, make sure all variables are set for Production, Preview, and Development

---

**Yes, you can paste your entire .env! Just look for the "Import" or "Bulk Import" button in Vercel! 🚀**
