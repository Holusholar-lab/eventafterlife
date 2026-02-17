# Check Video URL for: 1771343167952

## Steps to Fix Your Video

### Step 1: Check the Video URL in Admin Panel

1. **Go to your admin panel**: `https://eventafterlife.vercel.app/admin/videos`
2. **Find the video** with ID `1771343167952` (or title "Test 1")
3. **Click "Edit"**
4. **Check the "Video URL" field**

### Step 2: Verify URL Format

The video URL should be in one of these formats:

**✅ Correct Format 1: Full Bunny Embed URL**
```
https://iframe.mediadelivery.net/embed/601163/YOUR_VIDEO_ID
```
Example:
```
https://iframe.mediadelivery.net/embed/601163/423a966f-2a0c-459b-a7b4-584a6c6e04e4
```

**✅ Correct Format 2: Just Video ID (GUID)**
```
423a966f-2a0c-459b-a7b4-584a6c6e04e4
```
(Just the GUID, no URL - the system will add the library ID automatically)

**✅ Correct Format 3: YouTube URL**
```
https://www.youtube.com/watch?v=VIDEO_ID
```
or
```
https://youtu.be/VIDEO_ID
```

**✅ Correct Format 4: Vimeo URL**
```
https://vimeo.com/VIDEO_ID
```

**❌ Wrong Formats:**
- Empty or blank
- Just text without a valid URL
- Incomplete URL
- Wrong Bunny.net URL format

### Step 3: Fix the Video URL

**If the URL is wrong or empty:**

1. **For Bunny.net videos:**
   - Go to Bunny Dashboard → Stream → Library (601163)
   - Find your video
   - Copy the **Video ID** (GUID format: `xxxx-xxxx-xxxx-xxxx`)
   - In admin panel, paste either:
     - Full URL: `https://iframe.mediadelivery.net/embed/601163/VIDEO_ID`
     - OR just the Video ID: `VIDEO_ID`

2. **Save the video**

### Step 4: Configure Bunny.net Domain Security

**Even with correct URL, you need to allow your domain:**

1. Go to: https://bunny.net/dashboard
2. Navigate to: **Stream** → **Library** (601163) → **Security**
3. In **"Allowed Domains"**, add:
   ```
   eventafterlife.vercel.app
   *.vercel.app
   ```
4. **Save**
5. **Wait 1-2 minutes**

### Step 5: Test Again

1. Refresh: `https://eventafterlife.vercel.app/watch/1771343167952`
2. Video should now play!

## Quick Diagnostic

**Check these things:**

- [ ] Video URL is not empty
- [ ] Video URL matches one of the correct formats above
- [ ] Video is marked as "Public" (you can see this in the screenshot ✅)
- [ ] Video is marked as "Active" (check in admin panel)
- [ ] `eventafterlife.vercel.app` is added to Bunny.net Allowed Domains
- [ ] `*.vercel.app` is added to Bunny.net Allowed Domains
- [ ] Waited 1-2 minutes after adding domains

## Common Issues

### Issue 1: Video URL is Empty
**Solution:** Add the video URL in admin panel → Edit video

### Issue 2: Wrong URL Format
**Solution:** Use one of the correct formats listed above

### Issue 3: Domain Not Allowed
**Solution:** Add your Vercel domain to Bunny.net Security settings

### Issue 4: Video Not Active
**Solution:** In admin panel → Videos → Toggle "Active" to ON

---

**Check the video URL first, then configure Bunny.net domains!**
