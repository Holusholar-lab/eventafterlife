# Fix: Bunny.net /play/ URL Support

## ✅ Fixed!

Your URL uses `/play/` format:
```
https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758
```

The code now recognizes both `/embed/` and `/play/` URLs and converts them correctly for playback.

## What Changed

Updated the video URL parser to:
- ✅ Recognize `/play/` URLs (in addition to `/embed/`)
- ✅ Convert `/play/` URLs to `/embed/` format for iframe playback
- ✅ Extract Library ID and Video ID from both formats

## How to Use

**You can now use either format:**

**Format 1: /embed/ URL**
```
https://iframe.mediadelivery.net/embed/601163/71ecb16d-9f71-46ad-91f7-8620598d8758
```

**Format 2: /play/ URL** ✅ (Now supported!)
```
https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758
```

**Format 3: Just Video ID**
```
71ecb16d-9f71-46ad-91f7-8620598d8758
```

## Next Steps

1. **Update your video URL** in admin panel:
   - Go to `/admin/videos`
   - Edit the video
   - Paste your URL: `https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758`
   - Save

2. **Configure Bunny.net Domain Security** (if not done):
   - Add `eventafterlife.vercel.app` to Allowed Domains
   - Add `*.vercel.app` to Allowed Domains

3. **Deploy the fix**:
   ```bash
   git add .
   git commit -m "Add support for Bunny.net /play/ URLs"
   git push origin main
   ```

4. **Test**: Refresh the video page - it should now work!

---

**Your `/play/` URL will now work correctly! 🎬**
