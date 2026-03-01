# TechSci CodeCraft Agency

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-f472b6?style=for-the-badge&logo=bun)](https://bun.sh/)

Production digital product marketplace for CodeCraft Agency (TechSci Inc.). Integrates with Whop for payments, auto-provisions customer access, and provides secure portals for customers and admins.

**Live:** [codecraft.techsci.xyz](https://codecraft.techsci.xyz) | **Last updated:** March 2, 2026

---

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation & Database (14 models, PostgreSQL/Neon) | ✅ |
| 2 | Authentication (Google OAuth + Email OTP) | ✅ |
| 3 | Public Website (products, legal, SEO) | ✅ |
| 4 | Whop Webhook Integration | ✅ |
| 5 | Customer Portal (dashboard, content, purchases) | ✅ |
| 6 | Admin Panel (products, users, access, webhooks) | ✅ |
| 7 | Production Polish (security headers, error boundaries) | ✅ |
| 8 | reCAPTCHA Enterprise (invisible, score-based) | ✅ |
| 9 | Discord integration, News feed, Blob access control | ✅ |
| 10 | AI Video Analyzer, Service Request Portal | ✅ |
| 11 | Production Hardening (Sentry, Redis rate limiting) | ✅ |
| + | PayPal webhook, Cron jobs, ISR performance | ✅ |
| + | MySQL → PostgreSQL (Neon) migration | ✅ |
| + | Delivery tracking, Admin Settings, Whop customer sync | ✅ |
| + | UserActivity logging, Dispute evidence API | ✅ |
| + | Admin dispute page, Legal pages aligned to Whop ToS | ✅ |

---

## Tech Stack

**Framework:** Next.js 16.1.6 (App Router), React 19, TypeScript, Bun

**Database:** PostgreSQL (Neon serverless), Prisma 7 + `@prisma/adapter-neon`

**Auth:** NextAuth.js v5 — Google OAuth + Email/Password (6-digit OTP), bcryptjs

**Styling:** Tailwind CSS v4 (no config file), shadcn/ui, Lucide icons

**Payments:** Whop (primary) + PayPal SDK

**Email:** Resend — 8 transactional templates

**Monitoring:** Sentry v10, Vercel Analytics, Vercel Speed Insights

**Rate limiting:** Upstash Redis (`lib/rate-limit.ts`)

**Other:** OpenAI (gpt-4o-mini), Vercel Blob, reCAPTCHA Enterprise, Zod v4

---

## Quick Start

```bash
# Install
bun install

# Environment
cp .env.example .env.local   # fill in all vars

# Database
bunx prisma generate
bunx prisma db push
bun lib/db/seed.ts

# Dev server
bun dev
```

---

## Commands

```bash
bun dev                  # dev server (localhost:3000)
bun run build            # production build
bun run lint             # ESLint
bunx prisma db push      # push schema changes
bunx prisma studio       # DB GUI
bun lib/db/seed.ts       # seed database

# Run scripts (needs .env.local sourced)
set -a && source .env.local && set +a && npx tsx scripts/<name>.ts
```

---

## Environment Variables

**Core:** `DATABASE_URL` (Neon pooled), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

**Auth:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Email:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

**Whop:** `WHOP_WEBHOOK_SECRET`, `WHOP_API_KEY`, `WHOP_COMPANY_ID`

**PayPal:** `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_ENV`, `PAYPAL_WEBHOOK_ID`

**Services:** `BLOB_READ_WRITE_TOKEN` (auto), `SENTRY_DSN`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `OPENAI_API_KEY`, `CRON_SECRET`

**reCAPTCHA:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_API_KEY`

**App:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_NAME`, `ADMIN_EMAIL`, `CONTACT_EMAIL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Local only:** `SEED_ADMIN_PASSWORD`, `SEED_CUSTOMER_PASSWORD`

---

## Architecture

**14 DB Models:** User, Account, Session, VerificationToken, Product, ProductAccess, Purchase, ContentItem, WebhookLog, NewsItem, VideoAnalysis, ServiceRequest, AppSetting, UserActivity

**10 Products:**
1. Email Newsletter Starter Pack — $149
2. Landing Page CRO Boost — $597
3. Social Media Content Calendar — $199
4. Growth Accelerator Package — $599.67/mo
5. RealEstate AI Video Review — $29.99/mo
6. Shopify Speed Surge — $500
7. SEO Master Toolkit — $299
8. Email Automation Playbook — $249
9. Paid Ads Master Class — $449
10. E-Commerce Conversion Kit — $349

**Route groups:**
- `(public)` — `/`, `/products/*`, `/about`, `/contact`, `/terms`, `/refund`, `/privacy`
- `(auth)` — `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`
- `(dashboard)` — `/dashboard/**` (customer portal)
- `(admin)` — `/admin/**` (admin only) including `/admin/disputes/[purchaseId]`

**Key APIs:**
- `POST /api/webhooks/whop` — Whop webhook (HMAC-SHA256)
- `POST /api/webhooks/paypal` — PayPal webhook (API verification)
- `GET /api/admin/disputes/[purchaseId]/evidence` — dispute evidence JSON
- `GET /api/content/download/[id]` — auth-gated content proxy
- `GET/PUT /api/admin/settings` — AppSetting CRUD
- Cron: `/api/cron/cleanup-subscriptions`, `/api/cron/retry-webhooks`, `/api/cron/post-purchase-checkin`

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techsci.xyz | `SEED_ADMIN_PASSWORD` |
| Customer | customer@example.com | `SEED_CUSTOMER_PASSWORD` |

---

## Deployment

Auto-deploys on push to `main` via Vercel. No manual steps needed.

```bash
git push origin main   # triggers Vercel deploy
```

**Whop webhook:** `https://codecraft.techsci.xyz/api/webhooks/whop`
**PayPal webhook:** `https://codecraft.techsci.xyz/api/webhooks/paypal` (ID: `8ED47441RE716080D`)

---

## Company

TechSci Inc. (d/b/a CodeCraft Agency) · EIN: 35-2800827 · Delaware C-Corp

Support: support@techsci.xyz · Legal: legal@techsci.io · +1 (302) 314-6007
