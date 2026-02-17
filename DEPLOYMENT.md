# Deployment Guide: Event Afterlife to Vercel

This guide will help you deploy your website to production while maintaining admin control.

## Prerequisites

✅ You have:
- GitHub repository connected
- Vercel account
- Supabase project configured
- Bunny.net Stream library set up

## Step 1: Prepare Your Repository

### 1.1 Ensure `.env` is in `.gitignore`
Your `.env` file should already be ignored (check `.gitignore`). **Never commit sensitive keys to GitHub.**

### 1.2 Commit and Push Your Code
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

## Step 2: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

## Step 3: Configure Environment Variables in Vercel

In your Vercel project settings, go to **Settings → Environment Variables** and add:

### Required Variables:

```env
# Admin Access (CRITICAL - controls who can access /admin)
VITE_ADMIN_EMAIL=olufemiolushola8@gmail.com

# Supabase Configuration
VITE_SUPABASE_URL=https://upcvvwdlabgrvxkgkuow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Z2d2RsYWJncnZ4a2drdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzg0NjcsImV4cCI6MjA4Njg1NDQ2N30.1pZdHV3Gv4fIP9V18KuDzsVYgf8Dd0WD7jAr27gL2y4

# Bunny.net Stream Configuration
VITE_BUNNY_LIBRARY_ID=601163
VITE_BUNNY_CDN_HOST=https://event-afterlife-stream.b-cdn.net
VITE_BUNNY_STREAM_API_KEY=fd6a881d-29e0-4f7b-a7e19074d4ce-2b85-4a1d
```

### Important Notes:
- **Set these for ALL environments** (Production, Preview, Development)
- The `VITE_ADMIN_EMAIL` must match the email you use to log in
- Keep `VITE_BUNNY_STREAM_API_KEY` secret (consider moving to backend in future)

## Step 4: Configure Bunny.net Allowed Domains

1. Go to [Bunny Dashboard](https://bunny.net) → **Stream** → Your Library (ID: 601163)
2. Navigate to **Security** settings
3. Add your Vercel domain(s) to **Allowed Domains**:
   - `your-project.vercel.app` (Vercel default domain)
   - `yourdomain.com` (if you have a custom domain)
   - `*.vercel.app` (wildcard for preview deployments)

This ensures videos play correctly on your deployed site.

## Step 5: Configure Supabase (if needed)

### 5.1 Verify Supabase Tables
Make sure you've run the SQL schema in Supabase:
- Go to Supabase Dashboard → SQL Editor
- Run the SQL from `supabase/schema.sql`

### 5.2 Update Supabase RLS Policies (Optional but Recommended)
For production, consider restricting access:
- Keep current policies for MVP, or
- Add authentication-based policies later

## Step 6: Deploy

1. In Vercel, click **"Deploy"**
2. Vercel will:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy to production

3. Your site will be live at: `https://your-project.vercel.app`

## Step 7: Set Up Custom Domain (Optional)

1. In Vercel project → **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Bunny.net Allowed Domains with your custom domain

## Step 8: Verify Admin Access

1. Visit your deployed site
2. Sign up/Log in with the email: `olufemiolushola8@gmail.com`
3. Navigate to `/admin` - you should have full access
4. Test creating/editing videos
5. Verify videos play correctly

## Step 9: Continuous Deployment

✅ **You're all set!** Now:
- Every push to `main` branch = automatic production deployment
- Every pull request = preview deployment
- You can make changes locally, push to GitHub, and they'll deploy automatically

## Admin Control Workflow

### Making Changes That Affect All Users:

1. **Code Changes** (UI, features, etc.):
   ```bash
   git add .
   git commit -m "Update feature X"
   git push origin main
   ```
   → Auto-deploys to production

2. **Content Changes** (videos, categories):
   - Log in to your deployed site
   - Go to `/admin`
   - Add/edit videos directly
   - Changes are saved to Supabase (affects all users immediately)

3. **Configuration Changes** (env variables):
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update values
   - Redeploy (or wait for next deployment)

## Troubleshooting

### Videos Not Playing?
- Check Bunny.net Allowed Domains includes your Vercel domain
- Verify `VITE_BUNNY_CDN_HOST` is set correctly
- Check browser console for errors

### Admin Access Denied?
- Verify `VITE_ADMIN_EMAIL` matches your login email exactly
- Check email is case-insensitive (code handles this)
- Ensure you're logged in before accessing `/admin`

### Supabase Connection Issues?
- Verify `VITE_SUPABASE_URL` ends with `.co` (not `.com`)
- Check Supabase project is active
- Verify tables exist (run schema.sql if needed)

### Build Failures?
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

## Security Best Practices

1. ✅ **Never commit `.env` to GitHub** (already in `.gitignore`)
2. ✅ **Use Vercel Environment Variables** for all secrets
3. ⚠️ **Consider moving `VITE_BUNNY_STREAM_API_KEY` to backend** (future improvement)
4. ✅ **Admin access is email-based** - keep your email secure
5. ✅ **Supabase RLS policies** - review and tighten as needed

## Next Steps (Optional Improvements)

- [ ] Set up Supabase Authentication (replace localStorage auth)
- [ ] Move Bunny API key to backend API route
- [ ] Add analytics (Vercel Analytics or Google Analytics)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure custom domain with SSL
- [ ] Add CDN caching headers
- [ ] Set up staging environment

---

**Your site is now live and you have full admin control!** 🎉
