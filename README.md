<<<<<<< HEAD

# Cortex Forge Pro

Professional SaaS starter with:
- React
- TypeScript
- Tailwind
- Zustand
- Supabase
- TanStack Router

## Install

```bash
npm install
npm run dev
```
=======
# Nexus AI

Enterprise AI SaaS platform built on Lovable's modern stack.

## Stack

- **Frontend:** TanStack Start (React 19 + SSR), TypeScript, Tailwind v4, Shadcn UI, Framer Motion, Zustand, TanStack Query
- **Backend:** Lovable Cloud (Postgres + Auth + Storage + Server Functions) — replaces Express/MongoDB/JWT/bcrypt
- **AI:** Lovable AI Gateway (Gemini 3 Flash by default)
- **Auth:** Email/password + Google OAuth via Lovable Cloud

## Features

- Marketing site (Landing, Features, Pricing, Contact)
- Auth: register, login, logout, Google OAuth, protected routes, role-based access (admin/user)
- Dashboard with analytics cards, revenue chart, activity feed
- AI Workspace: multi-conversation chat, persistent history, suggestions, markdown rendering
- Profile + Settings (avatar, bio, password, notifications)
- Admin Console: manage users, ban, change roles, delete, activity log
- Glassmorphism dark UI, gradient mesh, smooth animations

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx                 — root layout, auth bridge, query client
│   ├── index.tsx                  — landing
│   ├── features.tsx, pricing.tsx, contact.tsx
│   ├── login.tsx, register.tsx
│   ├── _authenticated.tsx         — auth guard + sidebar layout
│   └── _authenticated/
│       ├── dashboard.tsx
│       ├── ai.tsx                 — AI workspace
│       ├── profile.tsx
│       ├── settings.tsx
│       └── admin.tsx              — admin console (role-gated)
├── lib/
│   ├── ai.functions.ts            — server fns: chat, conversations
│   ├── admin.functions.ts         — server fns: users, roles, stats
│   └── auth-store.ts              — Zustand session store
├── components/
│   ├── marketing/MarketingShell.tsx
│   └── ui/                        — Shadcn components
└── integrations/supabase/         — auto-generated Cloud client
```

## Database

- `profiles` — user metadata, auto-created on signup
- `user_roles` — separate roles table (prevents privilege escalation)
- `conversations`, `messages` — AI chat
- `activity_log` — admin audit feed
- All tables protected by Row-Level Security

## Deployment

Click **Publish** in the Lovable editor — frontend deploys to Cloudflare edge, backend stays on Lovable Cloud. No env setup needed; secrets are managed automatically.

## Becoming admin

After signing up, run this in the backend SQL editor:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ((SELECT id FROM auth.users WHERE email = 'you@example.com'), 'admin');
```

Then refresh — the Admin link will appear in the sidebar.
>>>>>>> 468f9075cec67ec109f6f66a10dbb49ba22950c1
