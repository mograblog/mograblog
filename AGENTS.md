# AI Agent Guidelines (Mograblog)

## 🚨 Critical Security & Privacy Rules

1. **NEVER Expose Private Email Addresses:**
   - Under no circumstances should the site owner's personal email address (`guy.mograbi@gmail.com`) be placed in public HTML templates, client-facing text, error messages, badges, footer links, or public documentation.
   - Any admin verification must be handled either server-side via Cloudflare Pages Functions (`functions/api/`) or referenced via secure environment variables (`ADMIN_EMAIL`).
   - Use generic, user-friendly labels in the UI (e.g., *"Sign in with your authorized admin account"*, *"● Admin Authenticated"*, or *"Access restricted to authorized administrators"*).

2. **No Hardcoded Secrets / Passwords:**
   - Never introduce fallback passwords, master secrets, or static API tokens in client or server code.
   - All sensitive credentials must remain in `.env` (ignored by git) and Cloudflare Pages Production Environment Variables.

3. **Authentication & Authorization:**
   - Authentication is exclusively powered by Clerk (Google, GitHub, and Email OTP/magic links).
   - Server-side functions verify Clerk session JWTs against Clerk's Backend API using `CLERK_SECRET_KEY`.

---

## 🛠 Project Architecture & Stack

- **Framework:** Astro 5 (Static Site Generation + Cloudflare Pages Functions for dynamic APIs).
- **Styling:** Tailwind CSS + Typography plugin.
- **Database:** Cloudflare D1 SQL Database (`ba9fa664-92b8-49f1-8455-209965ca77e9`).
- **Hosting & DNS:** Cloudflare Pages with custom domains `https://mograblog.com` and `https://www.mograblog.com`.
- **Build & Deploy:**
  - Build command: `npm run build`
  - Deploy command: `npm run deploy` (builds and deploys via Wrangler to Cloudflare Pages).

---

## 📢 Post-Publication Distribution Checklist

Whenever a new blog post is published and deployed, **ALWAYS** remind the user to distribute it, run `npm run share [slug]`, and provide pre-formatted, clickable 1-click submission links and titles for the following platforms:

1. **Daily.dev:**
   - Go to [app.daily.dev](https://app.daily.dev), click "New Post".
   - Switch bottom-left dropdown from "Free form" to **"Link"**.
   - Paste post URL and add a 1-2 sentence author note for higher engagement.
2. **Hacker News:**
   - Link: `https://news.ycombinator.com/submitlink?u=<URL>&t=<TITLE>` (Title + URL only; never put text in body).
   - Peak submission time: US morning / mid-day.
3. **Reddit (e.g., `r/LocalLLaMA`, `r/webdev`):**
   - Link: `https://www.reddit.com/submit?url=<URL>&title=<TITLE>` (Submit as Link Post).
   - Use flair **"I Built A Thing"** or **"Tutorial | Guide"**.
   - *Note:* If AutoMod blocks for low sub karma (<5), message the mods via the AutoMod link for manual approval.
4. **DEV.to:**
   - Review imported draft synced via RSS (`https://www.mograblog.com/rss.xml`).
   - Keep canonical URL set to Mograblog.
   - Drip-feed 1-2 articles per week rather than publishing all at once.

*(Note: Echo JS is omitted as the platform is inactive and aggressively blacklists blog domains).*


