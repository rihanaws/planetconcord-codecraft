# CLAUDE.md

## Status: All Phases Complete ✅ + Phase 10 + PayPal + Cron Jobs

**Phases Complete:** 1-10 (Foundation → Auth → Public Site → Whop → Customer Portal → Admin Panel → Polish → reCAPTCHA → Discord/Content/News → AI Video Analyzer / Service Requests / 4 New Products / Admin Upgrades)
**Session 9 fixes:** Sentry init, pool timeout, `/dashboard/products`, Tailwind v4 classes, Vercel Analytics, reCAPTCHA prod key
**Post-Phase 10:** PayPal live + sandbox keys, 3 cron jobs (subscription cleanup, video analysis cleanup, webhook retry queue)
**Phase 10:** AI Video Analyzer (OpenAI gpt-4o-mini), Service Request Portal, 4 new products, admin analytics upgrades
**PayPal:** Sandbox credentials wired in `.env.local` (No-Code Checkout ready)

## Tech Stack

- Next.js 16.1.6 (App Router, `proxy.ts` NOT `middleware.ts`)
- React 19.2.3 (Server Components default)
- TypeScript strict mode
- Bun (package manager)
- Tailwind v4 (CSS-first, NO config file) — use `bg-linear-to-*` not `bg-gradient-to-*`
- shadcn/ui (new-york, neutral)
- Prisma 7.3.0 + @prisma/adapter-mariadb
- MySQL (Hostinger: srv1833.hstgr.io:3306)
- NextAuth v5 (database sessions)
- Zod v4.3.6 (`.email()` still works — do NOT replace with `.format("email")`)
- Sentry v10 (`@sentry/nextjs` 10.38.0) — use `tracesSampleRate`, no `traces`/`replays`/`ConsoleIntegration`
- Resend (emails from noreply@techsci.xyz)
- @vercel/analytics + @vercel/speed-insights
- Google reCAPTCHA Enterprise (invisible, score 0.5 threshold)
- OpenAI (`openai` package, gpt-4o-mini for video analysis)
- PayPal SDK (sandbox No-Code Checkout — env-switched via NEXT_PUBLIC_PAYPAL_ENV)

## Commands

```bash
bun dev                    # Dev server
bun run build              # Production build
bun run lint               # Lint
bun run test               # Unit tests (Vitest)
bun run test:e2e           # E2E tests (Playwright)
bunx prisma db push        # Sync schema
bunx prisma studio         # DB GUI
bun lib/db/seed.ts         # Seed data
```

## Critical Rules

### Next.js 16
- ✅ Use `proxy.ts` (NOT `middleware.ts`)
- ✅ `params` is Promise in dynamic routes (await it)
- ✅ Suspense for `useSearchParams()`

### Tailwind v4
- ❌ NO `tailwind.config.ts`
- ✅ CSS config in `app/globals.css`
- ✅ OKLCH colors via CSS variables
- ✅ Use `bg-linear-to-*` (NOT `bg-gradient-to-*`)
- ✅ Use `-translate-x-full` / `translate-x-full` (NOT `translate-x-[-100%]` / `translate-x-[100%]`)

### Prisma 7
- ✅ Use MariaDB adapter for MySQL
- ✅ Each client gets its OWN adapter instance (independent pools)
- ✅ `prisma` — connectionLimit: 10 (page rendering + build)
- ✅ `prismaForAuth` — connectionLimit: 5 (NextAuth only)
- ✅ Product query functions wrapped in React `cache()` — prevents pool exhaustion during static generation

### Sentry v10
- ✅ `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` at root
- ✅ Use `tracesSampleRate: 1.0` (NOT `traces: true`)
- ❌ No `replays` (separate package in v10)
- ❌ No `ConsoleIntegration` (removed in v10)

### Client Components
- ❌ NEVER import Prisma/DB in client components
- ✅ Extract utilities to separate files (e.g., `lib/format.ts`)
- ✅ Use `"use client"` only for hooks/events/browser APIs

## Architecture

### DB Models (8)
User, Account, Session, VerificationToken, Product, ProductAccess, Purchase, ContentItem, WebhookLog

### Routes
- Public: `/`, `/products/*`, `/about`, `/contact`, `/terms`, `/privacy`, `/refund`
- Auth: `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`
- Protected: `/dashboard`, `/dashboard/products`, `/dashboard/products/[slug]`, `/dashboard/purchases`, `/dashboard/profile`
- Admin: `/admin`, `/admin/products/*`, `/admin/users`, `/admin/purchases`, `/admin/access`, `/admin/webhooks`

### Auth
- Google OAuth (auto email verification)
- Email/Password (6-digit OTP, 10-min expiry)
- bcryptjs (10 rounds)
- Role-based: CUSTOMER, ADMIN
- `signIn` callback uses `updateMany({ where: { email } })` — NOT `update({ where: { id } })`

### Email Templates (6)
verification-otp, welcome, purchase-confirmation, access-granted, password-reset, subscription-expiring

### Path Aliases
```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

## Design System

**Consistency Rule:** All pages MUST match exactly
- OKLCH colors from `globals.css`
- Geist fonts (Sans + Mono)
- Spacing: 4/8/12/16/24/32/48px
- Glass-morphic cards (backdrop blur)
- 200ms transitions
- Dark mode via CSS variables
- Mobile-first responsive

**Inspiration:** Linear, Stripe, Vercel, Whop

## Products (6)

1. Email Newsletter Starter Pack - $149
2. Landing Page CRO Boost - $597
3. Social Media Content Calendar - $199
4. Growth Accelerator Package - $599.67/mo
5. RealEstate AI Video Review - $29.99/mo
6. Shopify Speed Surge - $500

## Customer Flow

Public Site → Whop Checkout → Payment → Webhook → Auto-Create Account → Grant Access → Email → Login → Dashboard → Content

## Common Mistakes (DO NOT)

- ❌ `middleware.ts` → use `proxy.ts`
- ❌ `tailwind.config.ts` → Tailwind v4 doesn't need it
- ❌ `bg-gradient-to-*` → use `bg-linear-to-*`
- ❌ `translate-x-[-100%]` → use `-translate-x-full`
- ❌ `error.errors` with Zod → use `error.issues`
- ❌ Replace Zod `.email()` with `.format("email")` → `.email()` works fine in v4, `.format()` breaks TS
- ❌ String literals for enums → use `PricingType.ONE_TIME`
- ❌ Importing Prisma in client components
- ❌ Not awaiting `params` in dynamic routes
- ❌ Sharing one adapter between `prisma` and `prismaForAuth` → pool exhaustion at build
- ❌ Skipping React `cache()` on product queries → pool timeout during static generation
- ❌ `prisma.user.update` in NextAuth `signIn` callback → user row may not exist yet. Use `updateMany({ where: { email } })`
- ❌ Setting `GOOGLE_REDIRECT_URI` → NextAuth + `trustHost: true` handles it
- ❌ Using `NEXT_PUBLIC_GOOGLE_CLIENT_ID` → redundant, server-side `GOOGLE_CLIENT_ID` is enough
- ❌ Sentry `traces: true` → use `tracesSampleRate: 1.0` in v10
- ❌ Sentry `replays` or `ConsoleIntegration` → removed in v10

## Test Accounts

Admin: admin@techsci.xyz (password via SEED_ADMIN_PASSWORD)
Customer: customer@example.com (password via SEED_CUSTOMER_PASSWORD)

## Env Vars

All set on Vercel across Production, Preview, Development.

**Core:**
DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

**Auth:**
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

**reCAPTCHA Enterprise:**
NEXT_PUBLIC_RECAPTCHA_SITE_KEY (`6Len9GAsAAAAAEOmgoKiID2C5xQRVfHyLmMuUCUM` — production key), RECAPTCHA_API_KEY

**Email:**
RESEND_API_KEY, RESEND_FROM_EMAIL

**Whop:**
WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID

**Services:**
BLOB_READ_WRITE_TOKEN (auto-injected by Vercel Blob), SENTRY_DSN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, OPENAI_API_KEY, CRON_SECRET

**Cron Jobs (Vercel Pro):**
- `/api/cron/cleanup-subscriptions` — every 6 h. Expires ACTIVE ProductAccess past expiresAt, sends expiry email.
- `/api/cron/cleanup-video-analyses` — every 5 min. Fails PENDING VideoAnalysis older than 5 min.
- `/api/cron/retry-webhooks` — every 15 min. Re-runs failed WebhookLog entries (within 24 h window, max 10 per run).
- Auth: `Authorization: Bearer $CRON_SECRET` header (auto-injected by Vercel).

**PayPal (live keys active on Vercel Production):**
PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NEXT_PUBLIC_PAYPAL_ENV (`production` on prod, `sandbox` on preview/dev), PAYPAL_WEBHOOK_ID (`8ED47441RE716080D`). App: TechSci-Web-CodeCraft. Sandbox creds kept commented in .env.local for local testing.
- Webhook URL: `https://codecraft.techsci.xyz/api/webhooks/paypal`
- Events: PAYMENT.SALE.COMPLETED, PAYMENT.SALE.REFUNDED
- Verification: Uses PayPal's verification API (not HMAC)
- Metadata: Pass `custom` field with JSON: `{productSlug, customerEmail, customerName}`
- Schema: Purchase model has `paypalPaymentId` field (unique index)

**App:**
NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_NAME, ADMIN_EMAIL, CONTACT_EMAIL

**Local-only (do NOT set on Vercel):**
SEED_ADMIN_PASSWORD, SEED_CUSTOMER_PASSWORD (used only by `bun lib/db/seed.ts`)

**Removed from Vercel (were breaking things):**
- `GOOGLE_REDIRECT_URI` — NextAuth handles this automatically
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — redundant

## Whop Integration (Phase 4)

**Webhook Handler:** `/api/webhooks/whop`
- Signature verification (HMAC-SHA256, constant-time compare)
- Rate limiting (100 req/min per IP)
- Sentry error tracking
- 4 events: payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded
- Auto-creates users, grants access, sends emails
- Idempotency checks, transaction safety

**Testing:** `/api/webhooks/whop/test` (dev only), `/api/webhooks/whop/replay/[id]` (admin)
**Validations:** All Zod schemas in `lib/validations.ts`

## Customer Portal (Phase 5)

**Dashboard Routes:** `/dashboard`, `/dashboard/products`, `/dashboard/products/[slug]`, `/dashboard/purchases`, `/dashboard/profile`

**Features:**
- Sidebar navigation (desktop) + mobile menu
- Stats cards: Products owned, subscriptions, total spent
- Product access grid with expiration warnings
- Content viewer: Files (download), Links, Text (expandable), Videos (YouTube/Vimeo)
- Purchase history with search/filter/CSV export
- Profile management: Avatar upload, name/email, password change
- Connected OAuth accounts display

**API Routes:**
- `PUT /api/user/profile` - Update name/email
- `PUT /api/user/password` - Change password (requires current password)
- `POST /api/user/avatar` - Upload avatar to Vercel Blob (5MB max)

**Auth:** Uses NextAuth v5 `auth()` function (NOT `getServerSession`)
**Toast:** Sonner library via `hooks/use-toast.tsx`

## Admin Panel (Phase 6)

**Admin Routes:** `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/products/[id]/content`, `/admin/users`, `/admin/purchases`, `/admin/access`, `/admin/webhooks`

**Features:**
- Dashboard: Analytics cards (revenue, customers, products, webhooks), revenue bar chart by product, recent purchases + webhooks feeds
- Product Management: CRUD with slug auto-generation, JSON array fields (deliverables/features/requirements/faq), content item management (FILE/LINK/TEXT/VIDEO)
- User Management: Search/filter by role, detail modal with role changer, purchase + access history per user
- Access Management: Grant (LIFETIME/SUBSCRIPTION with expiry) and revoke with reason, summary stats, CSV export
- Purchases: Full table with search/status/product filters, CSV export
- Webhook Logs: Search/filter by status+event, detail modal with full payload viewer, retry failed webhooks

**API Routes:**
- `GET/POST /api/admin/products` - List / create products
- `GET/PUT/DELETE /api/admin/products/[id]` - Single product CRUD
- `POST/PUT/DELETE /api/admin/content` - Content item management
- `GET /api/admin/users` - List all users
- `GET/PUT /api/admin/users/[id]` - User detail / role update
- `GET /api/admin/access` - List all access records
- `POST /api/admin/access/grant` - Grant product access
- `POST /api/admin/access/revoke` - Revoke product access
- `GET /api/admin/webhooks` - List webhook logs
- `POST /api/admin/webhooks/[id]/retry` - Replay a webhook event

**Auth:** All routes guarded by `proxy.ts` (ADMIN role) + server-side `auth()` double-check
**Design:** Mirrors dashboard layout exactly — glass-morphic cards, same nav sidebar pattern, Suspense + Skeleton on every page

## Polish & Production (Phase 7)

**Security Headers** (`next.config.ts`):
- Strict-Transport-Security, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff)
- Referrer-Policy (strict-origin-when-cross-origin), Permissions-Policy, X-DNS-Prefetch-Control
- `poweredBy: false`, `compress: true`

**Sentry** (`instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`):
- All use: `dsn`, `environment`, `enableLogs`, `tracesSampleRate: 1.0`

**Error Handling:**
- `app/not-found.tsx` — custom 404 with glass card, atmospheric gradient, quick-nav links
- `app/error.tsx` — root error boundary (wraps Header/Footer)
- Route-group error boundaries: `(public)/error.tsx`, `(auth)/error.tsx`, `(dashboard)/dashboard/error.tsx`, `(admin)/admin/error.tsx`
- All error pages show error digest ID, Try Again + fallback link

**Image Optimization** (`next.config.ts` `images.remotePatterns`):
- `*.public.blob.vercel-storage.com` (Vercel Blob uploads)
- `lh3.googleusercontent.com` (Google OAuth avatars)
- `img.youtube.com`

**Testing:**
- Unit (Vitest): `tests/unit/auth-utils.test.ts`, `verify-signature.test.ts`, `validations.test.ts`, `webhook-handler.test.ts`
- E2E (Playwright): `tests/e2e/auth.spec.ts`, `public-pages.spec.ts`
- Scripts: `bun run test`, `bun run test:e2e`
- Config: `vitest.config.ts`, `playwright.config.ts`

**SEO:**
- `app/sitemap.ts` — dynamic, includes all products
- `app/robots.ts` — disallows /api/, /dashboard/, /admin/
- Root layout metadata: OG tags, Twitter cards, keywords

**Analytics:**
- `@vercel/analytics` — `<Analytics />` in layout.tsx
- `@vercel/speed-insights` — `<SpeedInsights />` in layout.tsx

## reCAPTCHA Enterprise (Phase 8)

- **Invisible** — no widget rendered, scores silently on form submit
- Script loaded globally in `app/layout.tsx` `<head>` via env var
- Site key: `6Len9GAsAAAAAEOmgoKiID2C5xQRVfHyLmMuUCUM` (production — replaced test key 2026-02-05)
- Client hook: `hooks/use-recaptcha.ts` → `executeRecaptcha(action)`
- Server utility: `lib/recaptcha.ts` → `verifyRecaptcha(token, action)` — score threshold 0.5, fails open in dev
- **Protected forms:** SIGNUP, FORGOT_PASSWORD, CONTACT, NEWSLETTER
- Each form passes `recaptchaToken` in POST body; each API route verifies before processing

## Google OAuth — Known Issues & Fixes

- NextAuth v5 callback path is `/api/auth/callback/google` (NOT `/api/auth/google/callback`)
- Google Cloud Console redirect URIs must match exactly
- `signIn` callback fires BEFORE Prisma adapter creates the user row → use `updateMany` not `update`
- App must be **published** in Google Cloud Console OAuth consent screen

## Reference Docs

- Main plan: `.claude/plans/dapper-nibbling-mango.md`
- Context: `.claude/project-context.md`
- Sessions: `sessions.md`
