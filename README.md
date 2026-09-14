# FounderLoop

An open feed where founders post the question keeping them up at night, and
experts who've already solved it write back. Built with React, Vite,
Tailwind CSS, and Supabase.

## What's in the MVP

- Founder and expert accounts (Supabase Auth + a `profiles` table with a `role`)
- An open feed of requests, visible to anyone signed in
- Founders can post requests; experts can respond
- No matching, payments, or notifications yet — just the core loop

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of `supabase/schema.sql`. This creates
   the `profiles`, `requests`, and `responses` tables with row-level security
   policies already wired up.
3. In **Settings → API**, copy your **Project URL** and **anon public key**.
4. In **Authentication → Providers**, make sure **Email** sign-up is enabled.
   For local development, you may also want to turn off "Confirm email" under
   **Authentication → Settings** so you can test sign-up instantly.

## 2. Configure the app

Copy `.env.example` to `.env` and fill in your Supabase values:

```
cp .env.example .env
```

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Run it locally

```
npm install
npm run dev
```

Visit the printed local URL. Sign up once as a founder and once as an expert
(two different emails) to try the full loop.

## 4. Deploy

Push this project to a GitHub repo, then:

1. Go to [vercel.com](https://vercel.com) and import the repo (Vercel
   auto-detects the Vite setup).
2. In the Vercel project's **Environment Variables**, add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values from
   your `.env`.
3. Deploy. You'll get a live URL like `founderloop.vercel.app`.

Netlify works the same way if you prefer it.

## Project structure

```
src/
  components/     Navbar
  lib/            Supabase client + auth context
  pages/          Landing, SignUp, Login, Feed, RequestDetail
supabase/
  schema.sql      Tables + RLS policies to run in Supabase
```

## What's deliberately not built yet

- Matching founders to specific experts
- Notifications (email/in-app) when a request gets a response
- Payments or paid expert tiers
- Editing/deleting your own posts from the UI (the DB policies already allow
  it — just needs buttons)

These were scoped out of v1 on purpose to keep the core loop — ask, answer,
see the answer — shippable fast.
