# Fix: Broken Video Icon (Media Failed to Load)

## 🔍 What the Broken Icon Means

The broken media icon (gray circle with jagged line) means:
- ❌ Video file cannot be loaded
- ❌ Video URL is invalid or inaccessible
- ❌ Domain security is blocking the video
- ❌ Video doesn't exist at that location

## ✅ Step-by-Step Fix

### Step 1: Check Video URL Format in Admin Panel

**This is CRITICAL - most common issue!**

1. Go to: `https://eventafterlife.vercel.app/admin/videos`
2. Find video ID: `1771343167952`
3. Click **"Edit"**
4. **Check "Video URL" field:**

   **What format is it?**
   
   **✅ CORRECT Formats:**
   - Full Bunny URL: `https://iframe.mediadelivery.net/embed/601163/71ecb16d-9f71-46ad-91f7-8620598d8758`
   - OR Bunny /play/ URL: `https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758`
   - OR Just Video ID: `71ecb16d-9f71-46ad-91f7-8620598d8758`
   
   **❌ WRONG Formats:**
   - Empty/blank
   - Wrong URL format
   - Incomplete URL

5. **If wrong, update to one of the correct formats above**
6. **Save**

### Step 2: Verify Bunny.net Video Exists

1. Go to: https://bunny.net/dashboard
2. Stream → Library (601163)
3. **Search for video ID:** `71ecb16d-9f71-46ad-91f7-8620598d8758`
4. **Check:**
   - Does the video exist?
   - What's the status? (Should be "Finished")
   - Is it still processing?

### Step 3: Verify Domain Security Settings

**Double-check Bunny.net Allowed Domains:**

1. Bunny Dashboard → Stream → Library (601163) → **Security**
2. **"Allowed Domains" section:**
   - Should have: `eventafterlife.vercel.app`
   - Should have: `*.vercel.app`
3. **If missing, add them:**
   ```
   eventafterlife.vercel.app
   *.vercel.app
   ```
4. **Save**
5. **Wait 2-3 minutes** (important!)

### Step 4: Deploy Code Changes

**Make sure the `/play/` URL support is deployed:**

```bash
git add .
git commit -m "Fix video playback - support /play/ URLs"
git push origin main
```

Wait for Vercel deployment to finish.

### Step 5: Clear Cache and Test

1. **Hard refresh** the video page:
   - Desktop: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Mobile: Close and reopen browser tab
2. **Test again**

## 🎯 Most Likely Issues

### Issue 1: Video URL Not Set Correctly
**Symptom:** Broken icon
**Fix:** Update Video URL in admin panel to correct format

### Issue 2: Domain Not Allowed
**Symptom:** Video loads but shows broken icon
**Fix:** Add `eventafterlife.vercel.app` to Bunny.net Allowed Domains

### Issue 3: Video Still Processing
**Symptom:** Video exists but not ready
**Fix:** Wait for Bunny.net to finish processing

### Issue 4: Wrong Video ID
**Symptom:** Video doesn't exist
**Fix:** Verify video ID in Bunny.net dashboard

## 🔧 Quick Test

**Try this in admin panel:**

1. Edit video
2. Replace Video URL with **just the Video ID:**
   ```
   71ecb16d-9f71-46ad-91f7-8620598d8758
   ```
3. Save
4. Refresh video page

This should work because your `.env` has `VITE_BUNNY_LIBRARY_ID=601163` set.

## 📝 What to Check Right Now

**Please verify:**

1. ✅ What is the current Video URL in `/admin/videos` → Edit?
2. ✅ Is `eventafterlife.vercel.app` in Bunny.net Allowed Domains?
3. ✅ Is the video status "Finished" in Bunny.net?
4. ✅ Have you deployed the code changes?

---

**The broken icon means the video can't load. Check the Video URL format first!**
