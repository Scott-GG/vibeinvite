# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: VibeInvite — Premium Digital Invitation SaaS

High-end digital invitation platform for western social etiquette events (Weddings, Galas, Milestone Parties). Core value: "High-fidelity paper-like unboxing experience + Zero-friction RSVP guest management."

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Email/SMS:** Resend (transactional email) + Twilio (SMS)
- **Payments:** Creem (Merchant of Record — one-time + subscription via `@creem_io/nextjs` SDK)
- **AI:** OpenAI API / Anthropic Claude API (copywriting & layout generation)

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## System Architecture

```
[Frontend: Next.js + Framer Motion]
       | (Authed REST / Realtime Subscription)
       v
[Backend: Supabase] --(Edge Functions)--> [Third-Party APIs: Resend/Creem/AI]
       |
       v
[PostgreSQL Database]
```

## Database Schema (Supabase/PostgreSQL)

- **profiles** — Extended user profile, linked to `auth.users` via FK (`id UUID REFERENCES auth.users ON DELETE CASCADE`)
- **events** — Core event entity. Belongs to `profiles.user_id`. Stores title, event_type, date, location, cover_image_url, and `config JSONB` for theme customization.
- **guests** — Belongs to `events`. Has status (pending/accepted/declined), plus_one fields, dietary_restrictions, custom_responses JSONB, and `access_token UUID` for passwordless guest access.
- **tables** — Seating chart (Phase 2). Belongs to `events`. Guests reference a table via `table_id`.

**Security:** RLS policies must be strict — hosts must never see other hosts' data.

## Development Phases

1. Auth & Event Dashboard (MVP) — Magic Link + Google OAuth, event creation wizard
2. Premium RSVP Page — Framer Motion envelope animation, guest RSVP form via access_token
3. Host Dashboard & CRM — Realtime analytics, bulk email via Resend
4. AI & Seating — AI copywriter, drag-and-drop seating chart

## Non-Functional Requirements

- RSVP landing page Lighthouse >90 on Mobile
- Shared links must unfurl OpenGraph images
- Guest data secured with strict RLS policies
