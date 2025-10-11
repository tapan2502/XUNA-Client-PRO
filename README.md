# Vite + React + TypeScript + RTK + HeroUI + Firebase

Primary UI = **HeroUI**. Tailwind is included only for utilities and HeroUI plugin.

## Quickstart

```bash
pnpm i
cp .env.example .env # fill Firebase + backend values
pnpm dev
```

- Sign up / sign in flows are wired to Firebase.
- Axios client auto-injects Firebase ID token on requests to `VITE_BACKEND_URL`.
- No agents API code yet (intentionally omitted).
