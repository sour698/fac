# FactoryPULSE AI — Frontend Deployment Guide

## Project Structure

```
factorypulse/
├── public/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Machine.jsx
│   │   ├── Prediction.jsx
│   │   ├── Report.jsx
│   │   ├── SettingsPage.jsx
│   │   └── AIAssistant.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml       ← for Netlify
└── vercel.json        ← for Vercel
```

---

## Step 1 — Install Node.js

Download from https://nodejs.org (LTS version recommended, v18+).

Verify: `node --version` and `npm --version`

---

## Step 2 — Set Up the Project Locally

```bash
# Navigate to the project folder
cd factorypulse

# Install all dependencies
npm install

# Start local dev server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Step 3 — Build for Production

```bash
npm run build
```

This creates a `dist/` folder with the optimized static files.

---

## Step 4 — Deploy

### Option A: Netlify (Easiest — Free)

1. Go to https://netlify.com and sign up
2. Click **"Add new site" → "Import an existing project"**
3. Connect your GitHub repo (push your code there first)
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click Deploy — done! You get a free URL like `yoursite.netlify.app`

**Or drag-and-drop:** Run `npm run build`, then drag the `dist/` folder into netlify.com/drop

---

### Option B: Vercel (Also Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts — Vercel auto-detects Vite
```

Or go to https://vercel.com → Import GitHub repo → auto-deploys.

---

### Option C: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

Add `base: '/repo-name/'` to `vite.config.js` if deploying to a subdirectory.

---

## Notes

- **Auth**: Uses browser localStorage — data stays local, no server needed
- **AI Assistant**: Uses Anthropic Claude API directly from the browser
- **Machine/Prediction pages**: Work with CSV file uploads, no backend needed
- **Reports**: Shows sample data when no backend is connected
