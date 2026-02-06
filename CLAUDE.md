# CLAUDE.md

## Status (Updated 2026-02-05)
All 10 phases complete + PayPal + Cron + Prisma Accelerate + ISR optimization.
**Commit:** `d40c270` | **Live:** https://codecraft.techsci.xyz | **Products:** 10

## Stack
Next.js 16.1.6 (App Router), React 19, TypeScript, Bun, Tailwind v4, Prisma 7 + MariaDB adapter, MySQL (Hostinger), NextAuth v5, Zod v4, Sentry v10, Resend, Vercel Analytics, reCAPTCHA Enterprise, OpenAI, PayPal SDK, @prisma/extension-accelerate

## Commands
```bash
bun dev | bun run build | bun run lint
bunx prisma db push | bunx prisma studio | bun lib/db/seed.ts
```

## Critical Rules

**Next.js 16:** `proxy.ts` not `middleware.ts`; `params` is Promise (await it); Suspense for `useSearchParams()`

**Tailwind v4:** NO config file; `bg-linear-to-*` not `bg-gradient-to-*`; `-translate-x-full` not `translate-x-[-100%]`

**Prisma 7:** MariaDB adapter; independent pools (15 main, 5 auth); React `cache()` on reads; Accelerate for Vercel (checks `PRISMA_DATABASE_URL`)

**NextAuth v5:** `auth()` not `getServerSession`; callback: `/api/auth/callback/google`; `updateMany` in signIn

**Zod v4:** `.email()` works; use `error.issues` not `error.errors`

**Sentry v10:** `tracesSampleRate: 1.0`; no `replays`/`ConsoleIntegration`

**Client Components:** Never import Prisma; use enums not strings

## Architecture

**Models (12):** User, Account, Session, VerificationToken, Product, ProductAccess, Purchase, ContentItem, WebhookLog, NewsItem, VideoAnalysis, ServiceRequest

**Routes:**
- Public: `/`, `/products/*`, `/about`, `/contact`, legal pages
- Auth: `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`
- Dashboard: `/dashboard`, `/dashboard/products`, `/dashboard/products/[slug]`, `/dashboard/purchases`, `/dashboard/profile`
- Admin: `/admin`, `/admin/products/*`, `/admin/users`, `/admin/purchases`, `/admin/access`, `/admin/webhooks`, `/admin/news`, `/admin/service-requests`

**Auth:** Google OAuth + Email/Password (6-digit OTP, 10-min expiry), bcryptjs (10 rounds), role-based (CUSTOMER/ADMIN)

**Emails (6):** verification-otp, welcome, purchase-confirmation, access-granted, password-reset, subscription-expiring

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

## Webhooks

**Whop:** `https://codecraft.techsci.xyz/api/webhooks/whop`
- Events: payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded
- Verification: HMAC-SHA256 (constant-time compare)
- Rate limit: 100 req/min per IP

**PayPal:** `https://codecraft.techsci.xyz/api/webhooks/paypal`
- Webhook ID: `8ED47441RE716080D`
- Events: PAYMENT.SALE.COMPLETED, PAYMENT.SALE.REFUNDED
- Verification: PayPal API (not HMAC) - `/v1/notifications/verify-webhook-signature`
- Metadata: `custom` field JSON with `{productSlug, customerEmail, customerName}`
- Schema: Purchase.paypalPaymentId String? @unique

## Cron Jobs (Vercel Pro)
Auth: `Authorization: Bearer $CRON_SECRET` (auto-injected)

1. **cleanup-subscriptions** (`0 */6 * * *`) - `/api/cron/cleanup-subscriptions`
   - Expires ACTIVE ProductAccess past expiresAt, sends email

2. **cleanup-video-analyses** (`*/5 * * * *`) - `/api/cron/cleanup-video-analyses`
   - Fails PENDING VideoAnalysis older than 5 min

3. **retry-webhooks** (`*/15 * * * *`) - `/api/cron/retry-webhooks`
   - Retries failed WebhookLog (24h window, max 10/run), handles Whop + PayPal

## Env Vars (All 3 Vercel Envs)

**Core:** DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

**Auth:** GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

**reCAPTCHA:** NEXT_PUBLIC_RECAPTCHA_SITE_KEY (`6Len9GAsAAAAAEOmgoKiID2C5xQRVfHyLmMuUCUM`), RECAPTCHA_API_KEY

**Email:** RESEND_API_KEY, RESEND_FROM_EMAIL

**Whop:** WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID

**Services:** BLOB_READ_WRITE_TOKEN (auto), SENTRY_DSN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, OPENAI_API_KEY, CRON_SECRET

**PayPal:** PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NEXT_PUBLIC_PAYPAL_ENV (`production` prod, `sandbox` preview/dev), PAYPAL_WEBHOOK_ID

**Prisma:** PRISMA_DATABASE_URL (Accelerate connection pooler for Vercel builds)

**App:** NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_NAME, ADMIN_EMAIL, CONTACT_EMAIL, NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA_MEASUREMENT_ID

**Local-only:** SEED_ADMIN_PASSWORD, SEED_CUSTOMER_PASSWORD

**Removed:** GOOGLE_REDIRECT_URI, NEXT_PUBLIC_GOOGLE_CLIENT_ID

## Performance

**ISR (Incremental Static Regeneration):**
- `/products` - revalidate: 600 (10 min)
- `/products/[slug]` - revalidate: 600 + generateStaticParams (pre-generate all)
- CDN-cached, ~30ms vs ~300ms server-rendered

**Prisma Accelerate:**
- Connection pooler for Vercel builds
- Prevents pool timeout errors (10 parallel workers)
- Falls back to direct MySQL locally

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
