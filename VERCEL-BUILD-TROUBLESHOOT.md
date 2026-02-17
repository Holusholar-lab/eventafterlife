# If Vercel build still fails

## 1. See the real error

"Command npm run build exited with 1" only means the build failed. To fix it you need the **actual** error:

1. In Vercel go to your project → **Deployments**.
2. Open the **failed** deployment.
3. Open the **Build** step (or **Building**).
4. Scroll in the log until you see red text or a line **above** "Command npm run build exited with 1". That line usually shows the real error (e.g. syntax error, missing module, file path).

Copy that error message (and the file path + line number if shown) and use it to fix the issue or ask for help.

## 2. Changes that often fix Vercel builds

- **Pushed latest code**  
  Make sure the repo Vercel deploys from has your latest commits (push from this folder and trigger a new deploy).

- **No dev-only code in production**  
  `vite.config.ts` now loads `lovable-tagger` only in development, so it won’t break the production build on Vercel.

- **Node version**  
  `package.json` has `"engines": { "node": ">=18" }`. In Vercel → Project Settings → General you can set **Node.js Version** to 18.x or 20.x if needed.

- **Install / build command**  
  Defaults are usually fine. If you changed them, use:
  - **Install Command:** `npm install` (or leave blank).
  - **Build Command:** `npm run build`.

## 3. Build locally first

Before pushing, run:

```bash
npm run build
```

If this succeeds, the same code should build on Vercel once the right branch is deployed and the steps above are checked.
