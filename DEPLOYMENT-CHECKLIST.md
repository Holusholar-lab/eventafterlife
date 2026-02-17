# Quick Deployment Checklist

## Pre-Deployment ✅

- [ ] Code is committed and pushed to GitHub
- [ ] `.env` is in `.gitignore` (never commit secrets)
- [ ] Supabase tables are created (run `supabase/schema.sql`)
- [ ] Bunny.net library is set up (Library ID: 601163)
- [ ] Bunny.net Pull Zone is configured

## Vercel Setup ✅

- [ ] GitHub repository connected to Vercel
- [ ] Project imported in Vercel dashboard
- [ ] Environment variables added (see below)

## Environment Variables (Add to Vercel) ✅

Copy these from your `.env` file to Vercel → Settings → Environment Variables:

```
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
```

**Important:** Set these for **Production**, **Preview**, and **Development** environments.

## Bunny.net Configuration ✅

- [ ] Go to Bunny Dashboard → Stream → Library (601163) → Security
- [ ] Add to Allowed Domains:
  - `your-project.vercel.app` (your Vercel domain)
  - `*.vercel.app` (for preview deployments)
  - Your custom domain (if applicable)

## Post-Deployment Verification ✅

- [ ] Site loads at `https://your-project.vercel.app`
- [ ] Can sign up/login
- [ ] Can access `/admin` with admin email
- [ ] Videos play correctly
- [ ] Can add/edit videos from admin panel
- [ ] Changes persist (saved to Supabase)

## Admin Workflow ✅

**To make changes that affect all users:**

1. **Code changes:** Edit locally → `git push` → Auto-deploys
2. **Content changes:** Log in → `/admin` → Edit videos → Saved to Supabase
3. **Config changes:** Vercel Dashboard → Environment Variables → Update → Redeploy

---

**That's it! Your site is live and you have full admin control.** 🚀
