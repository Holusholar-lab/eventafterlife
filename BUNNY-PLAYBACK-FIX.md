# Fix: "I still can't play the video" (Bunny.net)

If the video doesn’t play (black screen, inactive play button, or “Unable to play”), do these in order.

## 1. Allowed domains (most common cause)

Bunny Stream only allows playback on domains you list. If your site’s domain is missing, the player loads but stays blocked and won’t play.

**Steps:**

1. Go to [Bunny Dashboard](https://dash.bunny.net) → **Stream** → select your **Video Library**.
2. Open the **Security** (or **Manage** → **Security**) section.
3. Find **Allowed domains** (or **Embed view - Allowed hostnames**).
4. Add **every** domain where the site runs, one per line, for example:
   - `eventafterlife.vercel.app`
   - `www.eventafterlife.vercel.app`
   - `localhost` (for local dev)
   - `*.vercel.app` (if your provider supports wildcards)
5. Save.
6. Wait a minute, then **hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R) or try in an incognito window.

## 2. Video URL format in Admin

The **Video URL** in Admin must be a valid Bunny link or ID.

**Good examples:**

- Full embed:  
  `https://iframe.mediadelivery.net/embed/601163/71ecb16d-9f71-46ad-91f7-8620598d8758`
- Or play link (we accept this too):  
  `https://iframe.mediadelivery.net/play/601163/71ecb16d-9f71-46ad-91f7-8620598d8758`
- Or only the video ID (if `VITE_BUNNY_LIBRARY_ID` is set in `.env`):  
  `71ecb16d-9f71-46ad-91f7-8620598d8758`

**In Admin:**

1. Go to **Admin → Content → All Videos** (or **Videos**).
2. Edit the video.
3. Set **Video URL** to one of the formats above (no extra spaces or line breaks).
4. Save.

## 3. Env and deploy

- **Local:** In project root `.env` you should have at least:
  - `VITE_BUNNY_LIBRARY_ID=601163` (your library ID, no spaces).
- **Vercel (or other host):** Add the same variable in the project’s Environment Variables and redeploy so the built app has the correct library ID.

## 4. What we changed in the app

- The player now uses the **Bunny embed iframe first** (instead of trying direct MP4 first), which is what Bunny recommends and what works once Allowed domains are set.
- If playback still fails, the Watch page shows a short message reminding you to add this site’s domain to Bunny **Allowed domains** and to check the Video URL in Admin.

After updating Allowed domains and the Video URL, give it a minute and refresh; playback should work if the video is valid and the domain is allowed.
