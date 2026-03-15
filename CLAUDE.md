# CLAUDE.md

## Status (Updated 2026-03-15)
All 10 phases + Phase 11 (hardening) + Whop customer sync + dispute prevention + delivery tracking + admin settings + UserActivity logging + dispute evidence + admin dispute page + aligned legal pages + Whop V1 webhook fix + Whop balance sync + dispute timeline fix + checkin cron backfill.
**Live:** https://codecraft.techsci.xyz | **Products:** 10 | **Last commit:** 5eab524

## Stack
Next.js 16.1.6 (App Router), React 19, TypeScript, Bun, Tailwind v4, Prisma 7 + Neon adapter, PostgreSQL (Neon), NextAuth v5, Zod v4, Sentry v10, Resend, Vercel Analytics, reCAPTCHA Enterprise, OpenAI, PayPal SDK, Upstash Redis (rate limiting)

## Commands
```bash
bun dev | bun run build | bun run lint
bunx prisma db push | bunx prisma studio | bun lib/db/seed.ts
```

## Critical Rules

**Next.js 16:** `proxy.ts` not `middleware.ts`; `params` is Promise (await it); Suspense for `useSearchParams()`

**Tailwind v4:** NO config file; `bg-linear-to-*` not `bg-gradient-to-*`; `-translate-x-full` not `translate-x-[-100%]`

**Prisma 7:** Neon adapter (`@prisma/adapter-neon`); serverless-optimized with connection pooling; React `cache()` on reads

**NextAuth v5:** `auth()` not `getServerSession`; callback: `/api/auth/callback/google`; `updateMany` in signIn

**Zod v4:** `.email()` works; use `error.issues` not `error.errors`

**Sentry v10:** `tracesSampleRate: 1.0`; no `replays`/`ConsoleIntegration`; all 20+ API routes instrumented with `captureException` + route tags

**Client Components:** Never import Prisma; use enums not strings

## Architecture

**Models (14):** User, Account, Session, VerificationToken, Product, ProductAccess, Purchase, ContentItem, WebhookLog, NewsItem, VideoAnalysis, ServiceRequest, AppSetting, UserActivity

**Routes:**
- Public: `/`, `/products/*`, `/about`, `/contact`, legal pages
- Auth: `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`
- Dashboard: `/dashboard`, `/dashboard/products`, `/dashboard/products/[slug]`, `/dashboard/purchases`, `/dashboard/profile`
- Admin: `/admin`, `/admin/products/*`, `/admin/users`, `/admin/purchases`, `/admin/access`, `/admin/webhooks`, `/admin/news`, `/admin/service-requests`, `/admin/balance`, `/admin/settings`

**Auth:** Google OAuth + Email/Password (6-digit OTP, 10-min expiry), bcryptjs (10 rounds), role-based (CUSTOMER/ADMIN)

**Emails (8):** verification-otp, welcome, purchase-confirmation (w/ order details + billing descriptor), access-granted (w/ access type + next steps), password-reset, subscription-expiring (w/ renewal amount), post-purchase-checkin (2-day follow-up), refund-processed

## Products (10)
1. Email Newsletter Starter Pack - $149
2. Landing Page CRO Boost - $597
3. Social Media Content Calendar - $199
4. Growth Accelerator Package - $599.67/mo
5. RealEstate AI Video Review - $29.99/mo (AI video analyzer)
6. Shopify Speed Surge - $500 (service request portal)
7. SEO Master Toolkit - $299
8. Email Automation Playbook - $249
9. Paid Ads Master Class - $449
10. E-Commerce Conversion Kit - $349

## Rate Limiting (Upstash Redis)

Shared module: `lib/rate-limit.ts` — falls back to allow-all when `UPSTASH_REDIS_*` env vars missing (local dev).

| Limiter | Window | Max | Prefix | Used by |
|---------|--------|-----|--------|---------|
| `webhookRateLimit` | 60s sliding | 100 | `rl:webhook` | Whop + PayPal webhook routes |
| `authRateLimit` | 60s sliding | 10 | `rl:auth` | verify-email, verify-email/confirm, reset-password |
| `contactRateLimit` | 3600s sliding | 5 | `rl:contact` | contact form, newsletter |

## Webhooks

**Whop:** `https://codecraft.techsci.xyz/api/webhooks/whop`
- Events (V1 API, snake_case): `invoice_paid`, `membership_activated`, `membership_deactivated` + unknown events acknowledged silently (200)
- Verification: HMAC-SHA256 (constant-time compare); secret from DB (`whop_webhook_secret`) with env var fallback
- Rate limit: 100 req/min per IP (Upstash Redis)
- **IMPORTANT:** Whop V1 uses snake_case event names — NOT `payment.succeeded`/`membership.went_valid` (old dot-notation)

**PayPal:** `https://codecraft.techsci.xyz/api/webhooks/paypal`
- Webhook ID: `8ED47441RE716080D`
- Events: PAYMENT.SALE.COMPLETED, PAYMENT.SALE.REFUNDED
- Verification: PayPal API (not HMAC) - `/v1/notifications/verify-webhook-signature`
- Metadata: `custom` field JSON with `{productSlug, customerEmail, customerName}`
- Schema: Purchase.paypalPaymentId String? @unique

## Cron Jobs (Vercel Pro)
Auth: `Authorization: Bearer $CRON_SECRET` (auto-injected)

1. **cleanup-subscriptions** (`0 */6 * * *`) - `/api/cron/cleanup-subscriptions`
   - Expires ACTIVE ProductAccess past expiresAt, sends expiry email
   - Sends 3-day-before renewal reminders (2.5–3.5 day window)

2. **cleanup-video-analyses** (`*/5 * * * *`) - `/api/cron/cleanup-video-analyses`
   - Fails PENDING VideoAnalysis older than 5 min

3. **retry-webhooks** (`*/15 * * * *`) - `/api/cron/retry-webhooks`
   - Retries failed WebhookLog (24h window, max 10/run)
   - Routes by event type: `PAYMENT.*` → PayPal handler, others → Whop handler

4. **post-purchase-checkin** (`0 10 * * *`) - `/api/cron/post-purchase-checkin`
   - Sends check-in email ~48h after purchase (47h–7 day window — backfills missed purchases)
   - Tracks via `Purchase.checkinSentAt` to avoid double-sends
   - Includes billing descriptor reminder for dispute prevention

## Env Vars (All 3 Vercel Envs)

**Core:** DATABASE_URL (Neon pooled connection), NEXTAUTH_URL, NEXTAUTH_SECRET

**Auth:** GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

**reCAPTCHA:** NEXT_PUBLIC_RECAPTCHA_SITE_KEY (`6Len9GAsAAAAAEOmgoKiID2C5xQRVfHyLmMuUCUM`), RECAPTCHA_API_KEY

**Email:** RESEND_API_KEY, RESEND_FROM_EMAIL

**Whop:** WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID (also configurable via `/admin/settings` → AppSetting table, DB overrides env)

**Services:** BLOB_READ_WRITE_TOKEN (auto), SENTRY_DSN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, OPENAI_API_KEY, CRON_SECRET

**PayPal:** PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NEXT_PUBLIC_PAYPAL_ENV (`production` prod, `sandbox` preview/dev), PAYPAL_WEBHOOK_ID

**App:** NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_NAME, ADMIN_EMAIL, CONTACT_EMAIL, NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA_MEASUREMENT_ID

**Local-only:** SEED_ADMIN_PASSWORD, SEED_CUSTOMER_PASSWORD

**Removed:** GOOGLE_REDIRECT_URI, NEXT_PUBLIC_GOOGLE_CLIENT_ID, PRISMA_DATABASE_URL (no longer needed — Neon pooling is native)

## Performance

**ISR (Incremental Static Regeneration):**
- `/products` - revalidate: 600 (10 min)
- `/products/[slug]` - revalidate: 600 + generateStaticParams (pre-generate all)
- CDN-cached, ~30ms vs ~300ms server-rendered

**Neon PostgreSQL:**
- Native serverless driver with connection pooling
- Purpose-built for Vercel and serverless environments
- Single connection string for all environments (local + Vercel)
- Eliminates connection timeout issues from previous MySQL setup

## Phase 10 Features

**AI Video Analyzer** (RealEstate AI Video Review):
- OpenAI gpt-4o-mini JSON mode
- Quality/Engagement scores + category recommendations
- History with expandable results

**Service Request Portal** (Shopify Speed Surge):
- Submit store URL + notes + must-keep apps
- Admin status tracking + report upload to Blob
- Download reports when COMPLETE

**Admin Upgrades:**
- 6 analytics cards (added Total Content, Refund Rate)
- Content gap badges on ProductTable
- Service Requests page with filters + detail view

## Test Accounts
Admin: admin@techsci.xyz | Customer: customer@example.com (passwords via SEED_*_PASSWORD)

## Key Gotchas
- Zod `.email()` deprecation is hint-only; `.format("email")` breaks TS
- macOS sed needs `-i ''`; use `-print0 | xargs -0` for paths with parens
- Vercel env: `echo -n "value" | npx vercel env add NAME env --force`
- gcloud: `gcloud recaptcha keys` not `gcloud recaptchaenterprise keys`
- Vercel Blob: proxy paid content through auth-gated route, never send public URLs to browser
- Vercel Cron: defined in `vercel.json`, auth via `Authorization: Bearer $CRON_SECRET`
- PayPal webhook: use verification API with OAuth2 token, not HMAC
- PayPal metadata: pass via `custom` field as JSON string
- Next.js 15+: no `dynamic()` with `ssr: false` in server components
- Neon: use pooled connection string (`-pooler`) for all environments; regenerate Prisma Client after schema provider change
- Radix UI Accordion: hydration mismatches are expected (useId() generates different IDs on SSR vs client); use `suppressHydrationWarning` on Trigger/Content components
- Upstash rate limiting: `lib/rate-limit.ts` returns `allowed: true` when `UPSTASH_REDIS_*` env vars missing (graceful dev fallback); old `lib/whop/rate-limit.ts` is dead code
- Scripts in `scripts/`: run with `set -a && source .env.local && set +a && npx tsx scripts/<name>.ts` (needs DATABASE_URL)
- After adding fields to Prisma schema: run `bunx prisma generate` before `bun run build` (client must be regenerated)
- AppSetting cache (`lib/settings.ts`): 60s TTL in-memory cache; changes via `/admin/settings` take up to 60s to apply to webhook verification
- Date formatting: always use `formatInTimeZone(date, "UTC", fmt)` from `date-fns-tz` — bare `format()` from `date-fns` uses server local timezone (BST/UTC+6 on this machine)
- Whop API amounts: returned in **dollars** (not cents) — do NOT divide by 100
- Whop webhook events: V1 API uses `snake_case` (`invoice_paid`, `membership_activated`, `membership_deactivated`) — never dot-notation

## Purchase Delivery Tracking & Admin Settings (2026-02-15)

1. **Delivery tracking on Purchase** — `deliveredAt DateTime?`, `deliveryConfirmed Boolean`, `deliveryNotes String?`
2. **Delivery tracking on ProductAccess** — `deliveryStatus String? @default("PENDING")` (PENDING/DELIVERED/BACKLOGGED), `deliveredAt DateTime?`, `backlogNotes String?`
3. **AppSetting model** — key-value store for admin-configurable settings (key unique, value Text)
4. **Purchase table** — "Delivery" column with Pending/Delivered badges, "Mark Delivered" button on completed purchases
5. **Access table** — "Delivery" column with Pending/Delivered/Backlogged badges, "Deliver" and "Backlog" action buttons
6. **Admin Settings page** (`/admin/settings`) — 3 sections:
   - Whop Global Credentials: API Key, Webhook Secret, Company ID (masked inputs, save/copy per field, stored in AppSetting)
   - Webhook Endpoints: read-only Whop + PayPal URLs with copy buttons, PayPal Webhook ID
   - Per-Product Whop Mapping: editable table of all products with Whop Product ID + Checkout URL, Linked/Unlinked badges
7. **Settings helper** (`lib/settings.ts`) — in-memory 60s TTL cache for AppSetting values, env var fallback
8. **Whop webhook** — secret now read from DB via `getWhopWebhookSecret()`, falls back to `WHOP_WEBHOOK_SECRET` env var
9. **APIs**: `PATCH /api/admin/purchases/[id]/delivery`, `PATCH /api/admin/access/delivery`, `GET/PUT /api/admin/settings`, `PATCH /api/admin/products/[id]/whop`

## Whop Customer Sync & Dispute Prevention (2026-02-15)

1. **Customer sync** — 2 Whop customers granted LIFETIME access via `scripts/bulk-grant-access.ts`
   - George (ar3636998@yahoo.com) → Landing Page CRO Boost
   - George Peppas (georgepeppas172@gmail.com) → Shopify Speed Surge
   - Azaan Ali (axaanali6@gmail.com) — refunded, NO access (correct)
2. **Dispute prevention emails** — All purchase/access emails now include billing descriptor ("TECHSCI" / "CodeCraft Agency"), support contact (support@techsci.xyz, <4h response), and "contact us BEFORE your bank" warning
3. **Refund email** — `sendRefundProcessedEmail()` wired into both Whop + PayPal refund handlers
4. **Admin grant email** — `POST /api/admin/access/grant` now sends `sendAccessGrantedEmail()` on grant/reactivation
5. **Post-purchase check-in cron** — Daily 10 AM UTC, emails customers ~48h after purchase
6. **3-day renewal reminders** — `cleanup-subscriptions` cron extended to send reminders before expiry
7. **Schema** — `Purchase.checkinSentAt DateTime?` added
8. **Scripts** — `scripts/audit-users-and-access.ts`, `scripts/bulk-grant-access.ts`, `scripts/verify-access.ts` (run with `npx tsx scripts/<name>.ts`, requires `.env.local` sourced)
9. **Build config** — `whoplan/` and `scripts/` excluded from ESLint + TypeScript (tsconfig.json, eslint.config.mjs)

## Phase 11: Production Hardening (2026-02-07)

1. **Sentry on all API routes** — 19 routes now have `captureException` with route/method tags
2. **Upstash Redis rate limiting** — replaced in-memory `Map` rate limiters; shared `lib/rate-limit.ts`
3. **OTP brute-force protection** — `verify-email`, `verify-email/confirm`, `reset-password` rate-limited at 10 req/60s per IP
4. **PayPal webhook retry fix** — cron now dispatches by event type (`PAYMENT.*` → PayPal, else → Whop)
5. **File extension validation** — content upload route validates against allowlist of 30+ extensions
6. **Email normalization** — `.toLowerCase().trim()` on register, forgot-password, profile update
7. **Backward-compatible pagination** — admin users API supports `?page=1&limit=50`
8. **Old in-memory rate limiter** (`lib/whop/rate-limit.ts`) no longer imported by any route

## UserActivity Logging & Dispute Evidence (2026-02-19)

1. **UserActivity model** — `id`, `userId`, `action` (String), `metadata` (Json?), `createdAt`; indexes on `[userId, createdAt]` and `[action, createdAt]`
2. **Activity logger** (`lib/activity-logger.ts`) — fire-and-forget `logActivity(userId, action, metadata?)`, never throws
3. **Instrumented touchpoints** — LOGIN (signIn callback), PAGE_VIEW (dashboard + product detail), CONTENT_DOWNLOAD, VIDEO_ANALYZE, SERVICE_REQUEST
4. **Dispute evidence endpoint** — `GET /api/admin/disputes/[purchaseId]/evidence` — admin-only, returns JSON bundle: customer, purchase, product, access, activitySummary (totals + days active), full timeline, auto-generated disputeStatement
5. **Admin UI** — "Evidence" button on purchase table opens `/admin/disputes/[purchaseId]` page
6. **Prisma JSON typing** — use `Prisma.InputJsonValue` cast for `Record<string, unknown>` metadata

## Whop Balance Sync (2026-03-02)

1. **Admin Balance page** — `/admin/balance` — live Whop balance synced via API:
   - 3 cards: Available (green), Pending (amber), Reserve (blue)
   - Account details: company, ledger ID/type, transfer fee, payout email, KYC verification, payments approval
   - Multi-currency balance table
   - Withdrawal history (last 20) with status badges + UTC timestamps
   - Refresh button + "Open in Whop" external link
2. **API route** — `GET /api/admin/whop-balance` — admin-only, calls Whop `GET /api/v1/ledger_accounts/{company_id}` + withdrawals list; Sentry instrumented
3. **Whop amounts are in dollars** (not cents) — do NOT divide by 100
4. **Balance nav item** added to admin sidebar (before Settings)

## Whop V1 Webhook Fix (2026-03-02)

1. **Event name mismatch fixed** — Whop V1 API sends `snake_case`, old code expected `dot.notation` → every webhook was failing Zod with 400
2. **Schema updated** (`lib/validations.ts`) — `InvoicePaidSchema`, `MembershipActivatedSchema`, `MembershipDeactivatedSchema` + `WhopUnknownEventSchema` with `.passthrough()`
3. **Handler updated** (`lib/whop/webhook-handler.ts`) — switch cases now use V1 names
4. **Unknown events** return 200 (acknowledged) instead of 400 crash — prevents Whop retry storms
5. **Test payloads + test route** updated to V1 names

## Admin Dispute Evidence Page & Legal Alignment (2026-03-02)

1. **Admin dispute page** — `/admin/disputes/[purchaseId]` — full printable evidence page with:
   - Customer, transaction, product access, deliverables sections
   - Whop platform access log (hardcoded from Whop dispute evidence page)
   - Platform event timeline from DB
   - Auto-generated rebuttal statement with dates
   - Phase-by-phase refund analysis table (why $0 is owed)
   - `DisputePrintButton` client component → `window.print()` → Save as PDF
2. **Purchase table** — "Evidence" button now links to `/admin/disputes/[id]` (was raw JSON)
3. **`/terms` page** — full rewrite matching `whop-terms.md`: 16 sections, chargebacks §7, user responsibilities §4, IP ownership split, `legal@techsci.io` contact, EIN
4. **`/refund` page** — full rewrite matching `whop-refund.md`: milestone-based (not "30-day guarantee"), phase table ($250/$450/$1,080/$269), chargeback warning, non-refundable situations, `billing@techsci.io`
5. **Print CSS** — `globals.css` `@media print` hides nav/sidebar for clean PDF output
6. **Key dispute facts** (George / ar3636998@yahoo.com):
   - Purchase: Feb 2, 2026 at 8:28 PM UTC · Whop payment: pay_4XEFaQjGrdrwqH · $507.27
   - Access granted: Feb 2 (LIFETIME) · Email verified: Feb 2 at 8:35 PM UTC · Delivered: Feb 15
   - Membership terminated by Whop: Feb 17, 6:53 PM UTC (dispute protection alert)
   - Early dispute alerts: Feb 18 12:52 AM + 5:03 PM UTC
   - Dispute filed: Feb 26, 7:26 PM UTC (reason: "No cardholder authorisation")
   - Evidence deadline: April 6, 2026
   - **All timestamps on dispute page use UTC via `formatInTimeZone` (date-fns-tz) — never local timezone**

## Dispute Timeline & Cron Fixes (2026-03-15)

1. **Dispute page timeline** — Platform Event Timeline now includes 3 hardcoded entries from Whop's access log (not in DB): Feb 18 12:52 AM UTC (first early alert), Feb 18 5:03 PM UTC (second early alert), Feb 26 7:26 PM UTC (formal dispute filed). Sorted chronologically with access revocation (Feb 17).
2. **Checkin cron backfill** — `post-purchase-checkin` window widened from strict 47–49h to 47h–7 days. Catches purchases whose window was missed (e.g. cron deployed after window closed). `checkinSentAt` null guard prevents double-sends.
3. **Root cause (George)** — checkinSentAt was null because cron was added on Feb 5; George's 47–49h window was Feb 4. Cron arrived one day late.
4. **Scripts sourcing** — use `grep -v "^#" .env.local | grep "^[A-Z]" | while IFS= read -r line; do export "$line"; done` to source `.env.local` safely (avoids `set -a` breaking on comment lines with spaces)

## Recent Migrations (2026-02-06)

**Database: MySQL → PostgreSQL (Neon)**
- Migrated from Hostinger MySQL to Neon PostgreSQL
- Removed: `@prisma/adapter-mariadb`, `mariadb`, `@prisma/extension-accelerate`
- Added: `@prisma/adapter-neon`
- Schema: Changed `provider = "mysql"` to `provider = "postgresql"`
- Env: Updated `DATABASE_URL` to Neon pooled connection (all envs)
- Benefits: Native serverless connection pooling, eliminates timeout errors, simpler codebase
- Commits: `d7be1cf` (migration), `2a430de` (hydration fix)
