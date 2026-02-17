# Troubleshooting: Video Still Not Playing

## Step-by-Step Debugging

### Step 1: Verify Code is Deployed

**Have you deployed the code changes?**

The `/play/` URL support fix needs to be deployed. Check:

1. **Did you commit and push?**
   ```bash
   git status
   git add .
   git commit -m "Add support for Bunny.net /play/ URLs"
   git push origin main
   ```

2. **Check Vercel deployment:**
   - Go to Vercel dashboard
   - Check if latest deployment succeeded
   - Wait for deployment to finish

### Step 2: Check Video URL in Admin Panel

1. Go to: `https://eventafterlife.vercel.app/admin/videos`
2. Find video ID: `1771343167952`
3. Click "Edit"
4. **Check the "Video URL" field:**

   **What does it say?**
   - Is it empty?
   - Is it the `/play/` URL?
   - Is it something else?

5. **If it's not the `/play/` URL, update it to:**
   ```
   https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758
   ```
6. **Save**

### Step 3: Verify Bunny.net Domain Settings

**Double-check Bunny.net:**

1. Go to: https://bunny.net/dashboard
2. Stream → Library (601163) → Security
3. **Check "Allowed Domains":**
   - Is `eventafterlife.vercel.app` listed?
   - Is `*.vercel.app` listed?
   - Are there any typos?

4. **If not there, add them:**
   ```
   eventafterlife.vercel.app
   *.vercel.app
   ```
5. **Save**
6. **Wait 2-3 minutes** (sometimes takes longer)

### Step 4: Check Video Status in Bunny.net

1. Go to Bunny Dashboard → Stream → Library (601163)
2. Find video ID: `71ecb16d-9f71-46ad-91f7-8620598d8758`
3. **Check:**
   - Is video status "Finished"?
   - Is it processing?
   - Any errors?

### Step 5: Check Browser Console

**On your phone (if possible) or desktop:**

1. Open the video page: `https://eventafterlife.vercel.app/watch/1771343167952`
2. Open browser developer tools (if possible)
3. Check Console tab for errors
4. Look for messages like:
   - "Parsed URL: ..."
   - CORS errors
   - Domain errors
   - Video loading errors

### Step 6: Try Alternative URL Format

**In admin panel, try using just the Video ID:**

1. Edit the video
2. Replace Video URL with just:
   ```
   71ecb16d-9f71-46ad-91f7-8620598d8758
   ```
3. Save
4. Refresh video page

### Step 7: Verify Video is Active and Public

**In admin panel:**

1. Go to `/admin/videos`
2. Find your video
3. **Check:**
   - Is "Active" toggle ON? ✅
   - Is "Public" selected? ✅
   - If not, enable both

## Common Issues

### Issue 1: Code Not Deployed
**Symptom:** Video URL parser doesn't recognize `/play/` URLs
**Fix:** Deploy code changes

### Issue 2: Domain Not Added Correctly
**Symptom:** Bunny.net still blocking
**Fix:** Double-check domain spelling, save, wait 2-3 minutes

### Issue 3: Video URL Not Updated
**Symptom:** Old/empty URL still in database
**Fix:** Update video URL in admin panel

### Issue 4: Video Not Finished Processing
**Symptom:** Video still processing in Bunny.net
**Fix:** Wait for Bunny.net to finish processing

### Issue 5: Caching
**Symptom:** Old version cached
**Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Quick Test

**Try this URL format in admin panel:**

Just paste the Video ID:
```
71ecb16d-9f71-46ad-91f7-8620598d8758
```

The system should automatically build the embed URL using your Library ID (601163).

---

**Tell me:**
1. Have you deployed the code changes?
2. What's the current Video URL in admin panel?
3. Are the domains added in Bunny.net?
4. What error do you see (if any)?
