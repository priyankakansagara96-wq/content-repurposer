# Content Repurposing Studio

Paste one piece of proven, high-performing content — a blog post, email, or
social post — and get it repurposed into channel-native drafts for LinkedIn,
X, Facebook, Instagram, Email, SMS, Google/LinkedIn/Meta Ads, and educational
scripts, powered by Claude.

## How it's built

- **Frontend:** React + Vite
- **Backend:** a single Vercel serverless function (`api/repurpose.js`) that
  calls the Anthropic API. This exists so your API key stays private —
  a browser-only app can't call Anthropic directly without exposing the key
  to anyone who opens dev tools.

```
Browser (React) → /api/repurpose (serverless function, holds the key) → Anthropic API
```

## Run it locally

**1. Install dependencies**
```bash
npm install
```

**2. Install the Vercel CLI** (needed to run the serverless function locally —
`vite` alone can't run `/api` routes)
```bash
npm install -g vercel
```

**3. Add your API key**

Get a key from [console.anthropic.com](https://console.anthropic.com) →
API Keys. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Then paste your key into `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```

**4. Run the dev server**
```bash
vercel dev
```
This runs both the React app and the `/api/repurpose` function together,
usually at `http://localhost:3000`.

> If you only run `npm run dev` (plain Vite), the page will load but the
> "Repurpose Content" button will fail — Vite alone doesn't run the
> `/api` serverless function. Use `vercel dev` for local testing.

## Deploy it live (free)

**1. Push this project to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

**2. Deploy on Vercel**
- Go to [vercel.com](https://vercel.com) → sign up (free, no credit card needed)
- Click **Add New → Project**
- Import your GitHub repo
- Before clicking Deploy, expand **Environment Variables** and add:
  - Key: `ANTHROPIC_API_KEY`
  - Value: your real API key
- Click **Deploy**

Vercel will build and give you a live URL like:
`https://content-repurposer-yourname.vercel.app`

That's your shareable link — safe to put on your resume or portfolio, since
your API key lives only in Vercel's environment settings, never in the
public code.

## Cost

The Anthropic API is pay-as-you-go, not free — but this app is cheap to run.
Each "repurpose" click costs a fraction of a cent to a few cents depending on
how many channels you select and how long your source content is. Vercel's
free tier comfortably covers hosting for a portfolio project like this.

## Project structure

```
content-repurposer/
├── api/
│   └── repurpose.js      # serverless function, calls Anthropic, hides the key
├── src/
│   ├── App.jsx            # main UI
│   ├── main.jsx           # React entry point
│   └── index.css          # styles
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

## Customizing

- **Add/remove channels:** edit the `CHANNELS` array in both `src/App.jsx`
  and `CHANNEL_LABELS` in `api/repurpose.js` — keep the `key` values in sync
  between the two files.
- **Change tone/rules:** edit the prompt inside `api/repurpose.js` — that's
  where the instructions for how each channel should be written live.
- **Swap the visual style:** all styling is inline plus `src/index.css`,
  no external design system, so it's easy to reskin.
