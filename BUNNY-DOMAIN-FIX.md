# Fix: Video Not Playing on Mobile - Bunny.net Domain Security

## 🔍 Problem Identified

Your video is **public and visible** (you can see the "Public" badge), but it's **not playing** because Bunny.net is blocking it due to domain security settings.

## ✅ Solution: Add Your Domain to Bunny.net

### Step 1: Get Your Vercel Domain

From the screenshot, your site is at: **`eventafterlife.vercel.app`**

### Step 2: Add Domain to Bunny.net

1. **Go to Bunny Dashboard**: https://bunny.net/dashboard
2. **Navigate to**: Stream → Your Library (ID: 601163)
3. **Click**: "Security" tab (or Settings → Security)
4. **Find**: "Allowed Domains" section
5. **Add these domains** (one per line):
   ```
   eventafterlife.vercel.app
   *.vercel.app
   ```
   *(The `*.vercel.app` wildcard covers all preview deployments too)*

6. **Click**: "Save" or "Update"
7. **Wait**: 1-2 minutes for changes to propagate

### Step 3: Verify Video URL Format

Make sure your video URL in the admin panel is in one of these formats:

**Option 1: Full Bunny Embed URL**
```
https://iframe.mediadelivery.net/embed/601163/YOUR_VIDEO_ID
```

**Option 2: Just the Video ID** (if `VITE_BUNNY_LIBRARY_ID` is set)
```
YOUR_VIDEO_ID
```

### Step 4: Test Again

1. Refresh the page on your phone
2. The video should now play!

## 🎯 Quick Checklist

- [ ] Video is marked as "Public" ✅ (Already done - you can see the badge)
- [ ] Added `eventafterlife.vercel.app` to Bunny.net Allowed Domains
- [ ] Added `*.vercel.app` to Bunny.net Allowed Domains
- [ ] Saved changes in Bunny.net
- [ ] Waited 1-2 minutes
- [ ] Refreshed the page
- [ ] Video plays correctly

## 🔧 If Still Not Working

### Check Video URL Format

1. Go to `/admin/videos`
2. Click "Edit" on the video
3. Check the "Video URL" field
4. It should be:
   - Full embed URL: `https://iframe.mediadelivery.net/embed/601163/VIDEO_ID`
   - OR just the Video ID (GUID format)

### Verify Bunny.net Settings

1. **MP4 Fallback**: Make sure it's enabled in Bunny → Stream → Library → Encoding
2. **Pull Zone**: Verify `VITE_BUNNY_CDN_HOST` is set correctly in Vercel
3. **Video Status**: In Bunny Dashboard, make sure video status is "Finished"

### Check Browser Console

On your phone:
1. Open browser developer tools (if possible)
2. Check for any error messages
3. Look for CORS or domain-related errors

## 📝 Summary

**The Good News:**
- ✅ Video is public (visible to all users)
- ✅ Video is uploaded correctly
- ✅ Site is responsive

**The Issue:**
- ❌ Bunny.net is blocking playback due to domain security

**The Fix:**
- Add your Vercel domain to Bunny.net Allowed Domains
- Wait 1-2 minutes
- Refresh and test

---

**After adding the domain to Bunny.net, your videos will play correctly! 🎬**
