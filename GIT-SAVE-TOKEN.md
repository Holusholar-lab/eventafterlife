# Push Without Entering Token Every Time

## Option 1: Credential helper (recommended)

Git will remember your token after you enter it **once**.

### Step 1: Tell Git to store credentials

Run in Terminal:

```bash
git config --global credential.helper store
```

### Step 2: Push once with your token

Use the remote URL with your token **one time** (replace `YOUR_TOKEN` with your real token):

```bash
cd /Users/mosesolufemi/Downloads/learn-rent-share-main

git remote set-url origin https://Holusholar:YOUR_TOKEN@github.com/Holusholar-lab/eventafterlife.git
git push -u origin main
```

### Step 3: Remove token from the URL (keeps it only in stored credentials)

```bash
git remote set-url origin https://github.com/Holusholar-lab/eventafterlife.git
```

### Step 4: Next time you push

Just run:

```bash
git push
```

Git will use the stored credentials and **won’t ask for a password**.

---

## Option 2: Token in URL (no prompt, token in config)

You can leave the token in the remote URL. You’ll never be prompted, but the token stays in your Git config (plain text).

```bash
cd /Users/mosesolufemi/Downloads/learn-rent-share-main

git remote set-url origin https://Holusholar:YOUR_TOKEN@github.com/Holusholar-lab/eventafterlife.git
```

After this, `git push` will work without asking. Prefer Option 1 if you want the token out of the repo config and only in the credential store.
