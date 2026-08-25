# ZilVision AI

AI chat + AI image generation website, built with Next.js 14 (App Router), Tailwind CSS,
and NextAuth. Chat is free for everyone. Image Studio requires "Continue with Google".

## Features
- 💬 Free AI chat (no login) — powered by **Groq** (llama-3.3-70b, free & fast).
- 🖼️ AI Image Studio (login required) — powered by **Pollinations.ai** (free, no API key, no daily limit).
- 🔐 "Continue with Google" login via NextAuth.
- ⚙️ Settings page.
- 📄 Footer with Terms & Conditions, Privacy Policy, Rules & Regulations, Refund Policy, Contact.
- 🎨 Custom "aperture / vision" themed dark UI.

## 1. Install dependencies
```bash
npm install
```

## 2. Get your free API keys

### Groq (chat) — free
1. Go to https://console.groq.com/keys
2. Sign up (free) and click "Create API Key".
3. Copy the key into `GROQ_API_KEY` in `.env.local`.
Groq's free tier has generous per-minute/per-day request limits — more than enough for a chat feature like this.

### Image generation — Pollinations.ai (free, no key needed at all)
Pollinations.ai is used because it requires **no API key and has no hard daily cap**, unlike most
other free image APIs (Stability, Hugging Face, Together AI) which throttle you after a small
number of images per day. Nothing to configure — it just works out of the box.

If you ever want to swap providers later, only `app/api/image/route.ts` needs to change.

### Google OAuth (Continue with Google) — free
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a project (or use an existing one).
3. Click "Create Credentials" → "OAuth client ID" → Application type: **Web application**.
4. Under "Authorized redirect URIs" add:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret into `.env.local`.
6. Also set `NEXTAUTH_SECRET` — generate one with:
   ```bash
   openssl rand -base64 32
   ```

## 3. Create your `.env.local`
Copy `.env.example` to `.env.local` and fill in the values above:
```bash
cp .env.example .env.local
```

## 4. Run it
```bash
npm run dev
```
Open http://localhost:3000 — chat works immediately. Click "Continue with Google" to unlock
Image Studio at `/image`.

## 5. Deploy
Works out of the box on Vercel:
1. Push this project to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Update the Google OAuth "Authorized redirect URI" to your production domain.

## Project structure
```
app/
  page.tsx            → Chat page (free, home page)
  image/page.tsx       → Image Studio (protected)
  settings/page.tsx    → Settings (protected)
  login/page.tsx        → Custom sign-in page
  terms/ privacy/ rules/ refund/ contact/  → Legal & info pages
  api/chat/route.ts    → Groq chat endpoint
  api/image/route.ts    → Pollinations image endpoint (checks session)
  api/auth/[...nextauth]/route.ts → NextAuth handler
components/            → Header, Footer, ChatUI, ImageGenUI, SettingsPanel, etc.
middleware.ts          → Protects /image and /settings behind login
```

## Notes
- Chat history currently lives only in the browser tab's memory (not saved to a database).
  If you want persistent chat history per user, add a database (e.g. Postgres + Prisma or
  Supabase) and store messages keyed by `session.user.id`.
- Rate-limit Groq/Pollinations calls per user if you expect heavy traffic, to stay within
  free-tier limits comfortably.
