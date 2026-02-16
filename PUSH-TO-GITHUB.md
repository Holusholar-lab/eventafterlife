# How to Push This Project to GitHub

## Step 1: Create a repository on GitHub

1. Go to **https://github.com** and log in.
2. Click the **+** icon (top right) → **New repository**.
3. Enter a **Repository name** (e.g. `event-afterlife` or `learn-rent-share`).
4. Choose **Public**.
5. **Do not** check "Add a README" (you already have code).
6. Click **Create repository**.
7. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/REPO_NAME.git`).

---

## Step 2: Open Terminal in your project folder

Open Terminal (or Command Prompt) and go to your project:

```bash
cd /Users/mosesolufemi/Downloads/learn-rent-share-main
```

---

## Step 3: Initialize Git and push

Run these commands **one at a time** (replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repo name):

```bash
# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Event Afterlife app"

# Add your GitHub repo as remote (replace with YOUR URL from Step 1)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## If Git asks for login

- **Username:** your GitHub username  
- **Password:** use a **Personal Access Token** (GitHub no longer accepts account passwords for push):
  1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
  2. **Generate new token** → give it a name, check **repo**
  3. Copy the token and paste it when Git asks for a password

---

## Next time you make changes

```bash
git add .
git commit -m "Describe what you changed"
git push
```
