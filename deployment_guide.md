# 🚀 Deployment Guide — AI Powered Note App

> **Your Stack:**
> - **Frontend** → React + Vite → Deploy on **Vercel** (free)
> - **Backend** → Express + Node.js → Deploy on **Render** (free)
> - **Database** → MongoDB Atlas (already configured in your `.env`)

> [!NOTE]
> **Why not Railway?** Railway removed its free tier and now requires a paid plan. **Render** is the best free alternative — no credit card required, supports Node.js natively.

---

## 📋 Before You Start — Checklist

- [x] Your code is pushed to GitHub at `github.com/Dipan46/ai-powered-note-app`
- [x] Production `start` script already added to `server/package.json`
- [x] CORS already configured for production in `server/index.js`
- [x] Vite downgraded from v8 → v5 (fixes Vercel Linux build error)
- [x] Root `package-lock.json` regenerated (removes `rolldown` dependency)
- [ ] You have a free [Render](https://render.com) account (sign up with GitHub)
- [ ] You have a free [Vercel](https://vercel.com) account (sign up with GitHub)

> [!IMPORTANT]
> **Never commit your `.env` files to GitHub.** Your `.gitignore` already protects them. We will manually add the secrets in Render and Vercel dashboards.

> [!WARNING]
> **Render Free Tier Cold Starts** — Free Render services "sleep" after 15 minutes of no traffic. The first request after sleeping takes ~30–60 seconds to respond. This is normal and only affects the free plan.

---

## 🟣 PART 1 — Deploy Backend on Render

> Think of Render like a computer on the internet that runs your `server` folder 24/7 (for free!).

### Step 1 — Create a Render Account
1. Go to **[render.com](https://render.com)**
2. Click **"Get Started for Free"**
3. Click **"GitHub"** to sign up with your GitHub account → Authorize Render

### Step 2 — Create a New Web Service
1. On the Render dashboard, click **"+ New"** → select **"Web Service"**
2. Under **"Connect a repository"**, find and click on **`ai-powered-note-app`**
3. If you don't see it, click **"Connect account"** to give Render access to your GitHub repos

### Step 3 — Configure the Web Service
Render will show a configuration screen. Fill it in **exactly** like this:

| Setting | Value |
|---|---|
| **Name** | `ai-note-app-backend` (or any name you like) |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | `Free` ← make sure this is selected! |

> [!IMPORTANT]
> **Root Directory must be `server`** — this tells Render your backend code is inside the `server` subfolder, not the project root.

### Step 4 — Add Environment Variables
Scroll down to the **"Environment Variables"** section on the same page and add each one:

| Key | Value |
|---|---|
| `PORT` | `3001` |
| `MONGODB_URI` | *(copy from your `server/.env` file)* |
| `OPENROUTER_API_KEY` | *(copy from your `server/.env` file)* |
| `CLIENT_URL` | *(leave blank for now — fill after Vercel deploy)* |

> [!CAUTION]
> Copy the values directly from your local `server/.env` file. Do NOT share these keys publicly.

### Step 5 — Deploy!
1. Click **"Deploy Web Service"** at the bottom
2. Render will start building — watch the logs (takes ~2–3 minutes)
3. You'll see `==> Your service is live 🎉` in the logs

### Step 6 — Get Your Render URL
1. At the top of your service page, you'll see a URL like:
   ```
   https://ai-note-app-backend.onrender.com
   ```
2. **Copy this URL** — you'll need it for Vercel!

### Step 7 — Verify Backend is Running
Open your browser and go to:
```
https://ai-note-app-backend.onrender.com/api/notes
```
You should see `[]` (an empty array) or your notes as JSON. ✅

---

## ▲ PART 2 — Deploy Frontend on Vercel

> Vercel is a super-fast website host that serves your `client` folder to the world for free.

### Step 1 — Create a Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** → **"Continue with GitHub"** → Authorize Vercel

### Step 2 — Import Your Project
1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find **`ai-powered-note-app`** in the list → Click **"Import"**

### Step 3 — Configure the Project
> ⚠️ This is the most important step — fill these in **exactly** as shown.

Vercel will show a configuration screen. Fill it in like this:

| Setting | Value |
|---|---|
| **Framework Preset** | `Other` |
| **Root Directory** | Leave **blank** (keep as repo root `/`) |
| **Build Command** | `npm run build --workspace=client` |
| **Output Directory** | `client/dist` |
| **Install Command** | `npm install` |

> [!IMPORTANT]
> **Do NOT set Root Directory to `client`.** This project uses npm workspaces — Vercel must run `npm install` from the repo root so all workspace dependencies resolve correctly. Setting Root Directory to `client` breaks the install.
>
> The build command `npm run build --workspace=client` tells npm to run the build script inside the `client` workspace. The output goes to `client/dist`.

### Step 4 — Add Environment Variables
1. Expand the **"Environment Variables"** section
2. Add this variable:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://ai-note-app-backend.onrender.com/api` |

> Replace the URL with your actual Render URL from Part 1 Step 6.
>
> ✅ Correct format: `https://your-service-name.onrender.com/api` (ends with `/api`, no trailing slash)

> [!IMPORTANT]
> **Add the env variable BEFORE clicking Deploy.** Vite bakes environment variables into the JavaScript bundle at build time. If `VITE_API_URL` is missing during the build, all API calls will fail with a 404 error. If you forget, add the variable in Vercel → Settings → Environment Variables and then **Redeploy**.

### Step 5 — Deploy!
1. Click the big **"Deploy"** button
2. Wait ~2 minutes for Vercel to build and deploy
3. You'll see confetti 🎉 and a URL like:
   ```
   https://ai-powered-note-app.vercel.app
   ```

---

## 🔗 PART 3 — Connect Everything Together

### Step 1 — Add Vercel URL to Render
Now that you have your Vercel URL, go back to Render:
1. Open your Render service → **Environment** tab
2. Find `CLIENT_URL` and set it to your Vercel URL:
   ```
   https://ai-powered-note-app.vercel.app
   ```
3. Click **"Save Changes"** — Render will auto-restart your server

### Step 2 — Test Your App End-to-End
1. Open your Vercel URL in the browser
2. Try chatting with the AI (e.g. "Add a note: Buy milk")
3. Verify the note appears and persists after page refresh

---

## ✅ Final Checklist

| Check | Status |
|---|---|
| Backend deployed on Render | ✅ |
| Frontend deployed on Vercel | ✅ |
| `VITE_API_URL` in Vercel points to Render URL + `/api` | ✅ |
| `CLIENT_URL` in Render points to Vercel URL | ✅ |
| MongoDB Atlas Network Access allows `0.0.0.0/0` | ✅ |

---

## 🆘 Common Problems & Fixes

### ❌ "CORS Error" in browser console
- Go to Render → Environment → make sure `CLIENT_URL` is set to your **exact** Vercel URL (no trailing slash)
- Click Save and wait for Render to restart

### ❌ Backend shows "Build failed" on Render
- Go to Render → Logs → look for the error
- Most common cause: **Root Directory not set to `server`** — check in Settings → Root Directory

### ❌ Frontend shows blank page or "Network Error" / notes show 404
- Check Vercel → Settings → Environment Variables
- Make sure `VITE_API_URL` is set and ends with `/api` — **no trailing slash**
- After adding/changing the variable, you **must Redeploy** — Vercel bakes env vars into the build at compile time
- Go to Vercel → Deployments → click the 3 dots (⋯) → **Redeploy**

### ❌ Vercel build fails: "Cannot find native binding" / rolldown error
- This is a **Vite 8 + npm workspaces** incompatibility on Linux
- It is already fixed in this repo (downgraded to Vite 5, regenerated `package-lock.json`)
- If it reappears: delete `package-lock.json` from the repo root, run `npm install` locally, commit and push the new lock file

### ❌ First request takes 60 seconds (cold start)
- This is **normal** on Render's free plan — the server sleeps after 15 min of inactivity
- The app will wake up automatically; just wait ~30–60 seconds
- To avoid this, you can use [UptimeRobot](https://uptimerobot.com) (free) to ping your backend every 14 minutes

### ❌ MongoDB connection error
- Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

---

## 💡 Quick Reference

| Service | URL |
|---|---|
| **Frontend (Vercel)** | `https://ai-powered-note-app.vercel.app` |
| **Backend (Render)** | `https://ai-note-app-backend.onrender.com` |
| **API Base URL** | `https://ai-note-app-backend.onrender.com/api` |

---

> [!TIP]
> Both Vercel and Render auto-deploy whenever you `git push` to your `main` branch. Future updates are as simple as pushing code to GitHub!
