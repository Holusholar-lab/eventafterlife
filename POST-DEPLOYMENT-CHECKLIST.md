# Post-Deployment Verification Checklist

## ✅ Your Site is Deployed! Now Let's Verify Everything Works

---

## Step 1: Check Your Site URL

1. Go to your Vercel dashboard
2. Find your deployment (should show "Ready" status)
3. **Copy your site URL** - it will look like:
   - `https://your-project-name.vercel.app`

---

## Step 2: Test Public Pages

Open your site URL in a browser and check:

- [ ] **Homepage loads** - No errors, page displays correctly
- [ ] **Navigation works** - Can click through menu items
- [ ] **Library page loads** - `/library` shows your videos (if any)
- [ ] **Sign up/Login works** - Can create account or log in

---

## Step 3: Test Admin Access

**This is critical - verify admin control works!**

1. **Sign up or log in** with your admin email:
   - Email: `olufemiolushola8@gmail.com`
   - Use the password you created

2. **Navigate to admin panel:**
   - Go to: `https://your-site.vercel.app/admin`
   - Or click profile icon → should see admin link

3. **Verify admin dashboard loads:**
   - [ ] You see the admin sidebar
   - [ ] Dashboard shows stats/metrics
   - [ ] No "Access Denied" message

4. **Test admin features:**
   - [ ] Can navigate to "All Videos"
   - [ ] Can click "Upload Video"
   - [ ] Can see other admin sections (Users, Categories, etc.)

---

## Step 4: Test Video Playback

**If you have videos added:**

1. **Go to Library page** (`/library`)
2. **Click on a video**
3. **Verify:**
   - [ ] Video page loads (`/watch/:id`)
   - [ ] Video player appears
   - [ ] Video plays correctly (if Bunny.net video)
   - [ ] No errors in browser console

**If videos don't play:**
- Check Bunny.net Allowed Domains (see Step 5)

---

## Step 5: Configure Bunny.net (If Videos Don't Play)

**Only do this if videos aren't playing:**

1. Go to: https://bunny.net/dashboard
2. Navigate to: **Stream** → **Library** (ID: 601163)
3. Click **"Security"** tab
4. Find **"Allowed Domains"** section
5. **Add your Vercel domain:**
   ```
   your-project-name.vercel.app
   *.vercel.app
   ```
6. Click **"Save"**
7. Wait 1-2 minutes for changes to propagate
8. Refresh your site and test videos again

---

## Step 6: Test Content Management

**Verify you can make changes that affect all users:**

1. **Log in to your deployed site** (as admin)
2. **Go to `/admin/upload`**
3. **Try adding a test video:**
   - Fill in video details
   - Add a video URL (Bunny.net, YouTube, or direct link)
   - Click "Add Video"
   - [ ] Video is added successfully
   - [ ] Video appears in Library page (public)

4. **Go to `/admin/videos`**
5. **Try editing a video:**
   - Click "Edit" on any video
   - Make a change (title, description, etc.)
   - Save changes
   - [ ] Changes are saved
   - [ ] Changes appear on public site immediately

---

## Step 7: Verify Supabase Connection

**Check that data is saving to Supabase:**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **"Table Editor"**
4. Check tables:
   - [ ] `admin_videos` table exists
   - [ ] Videos you added appear in the table
   - [ ] Data matches what you see on your site

---

## Step 8: Test Continuous Deployment

**Verify auto-deployment works:**

1. **Make a small change locally** (e.g., change homepage text)
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. **Go to Vercel dashboard**
4. **Watch for new deployment:**
   - [ ] New deployment starts automatically
   - [ ] Deployment succeeds
   - [ ] Changes appear on live site

---

## ✅ Success Indicators

**Your deployment is successful if:**

- ✅ Site loads without errors
- ✅ Can log in with admin email
- ✅ Can access `/admin` panel
- ✅ Can add/edit videos from admin panel
- ✅ Videos play correctly (if configured)
- ✅ Changes save to Supabase
- ✅ Public users can see your content

---

## 🆘 Troubleshooting

### Site Shows "404" or "Not Found"?
- Check Vercel deployment logs
- Verify `vercel.json` exists and has correct rewrite rules
- Make sure build succeeded

### Can't Access Admin?
- Verify `VITE_ADMIN_EMAIL` in Vercel matches your login email exactly
- Make sure you're logged in before accessing `/admin`
- Check browser console for errors

### Videos Not Playing?
- Add your Vercel domain to Bunny.net Allowed Domains
- Verify `VITE_BUNNY_CDN_HOST` is set correctly
- Check browser console for specific errors

### Changes Not Saving?
- Verify Supabase connection (check Supabase dashboard)
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Make sure Supabase tables exist (run `supabase/schema.sql` if needed)

### Build Failed?
- Check Vercel deployment logs
- Verify all environment variables are set
- Make sure `package.json` has correct build script

---

## 🎉 You're All Set!

**Your site is live and you have full admin control!**

**To make changes:**
- **Code changes:** Edit → `git push` → Auto-deploys
- **Content changes:** Log in → `/admin` → Edit → Saves to Supabase

**Enjoy your live website! 🚀**
