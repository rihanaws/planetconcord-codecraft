# CLAUDE.md

## Status: Phase 8 Complete ✅ — All Phases Done + reCAPTCHA + Production Fixes

**Phases Complete:** 1-8 (Foundation, Auth, Public Site, Whop Integration, Customer Portal, Admin Panel, Polish & Production, reCAPTCHA Enterprise)

## Tech Stack

- Next.js 16.1.6 (App Router, `proxy.ts` NOT `middleware.ts`)
- React 19.2.3 (Server Components default)
- TypeScript strict mode
- Bun (package manager)
- Tailwind v4 (CSS-first, NO config file)
- shadcn/ui (new-york, neutral)
- Prisma 7.3.0 + @prisma/adapter-mariadb
- MySQL (Hostinger: srv1833.hstgr.io:3306)
- NextAuth v5 (database sessions)
- Resend (emails from noreply@techsci.xyz)

## Commands

```bash
bun dev                    # Dev server
bun run build              # Production build
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

### Prisma 7
- ✅ Use MariaDB adapter for MySQL
- ✅ Pass config object (NOT pool) to `new PrismaMariaDb()`
- ✅ Two clients: `prisma` (with adapter), `prismaForAuth` (for NextAuth)

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
- Protected: `/dashboard/*` (authenticated)
- Admin: `/admin/*` (ADMIN role)

### Auth
- Google OAuth (auto email verification)
- Email/Password (6-digit OTP, 10-min expiry)
- bcryptjs (10 rounds)
- Role-based: CUSTOMER, ADMIN

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

## Common Mistakes

- ❌ `middleware.ts` (use `proxy.ts`)
- ❌ `tailwind.config.ts` (Tailwind v4 doesn't need it)
- ❌ `error.errors` with Zod (use `error.issues`)
- ❌ String literals for enums (use `PricingType.ONE_TIME`)
- ❌ Importing Prisma in client components
- ❌ Not awaiting `params` in dynamic routes
- ❌ Inconsistent design
- ❌ `prisma.user.update` in NextAuth `signIn` callback — user row may not exist yet with db sessions. Use `updateMany({ where: { email } })` instead
- ❌ Setting `GOOGLE_REDIRECT_URI` anywhere — NextAuth + `trustHost: true` handles it automatically
- ❌ Using `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — redundant, server-side `GOOGLE_CLIENT_ID` is all that's needed

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
NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_API_KEY

**Email:**
RESEND_API_KEY, RESEND_FROM_EMAIL

**Whop:**
WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID

**Services:**
BLOB_READ_WRITE_TOKEN (auto-injected by Vercel Blob), SENTRY_DSN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

**App:**
NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SITE_NAME, ADMIN_EMAIL, CONTACT_EMAIL

**Local-only (do NOT set on Vercel):**
SEED_ADMIN_PASSWORD, SEED_CUSTOMER_PASSWORD (used only by `bun lib/db/seed.ts`)

**Removed from Vercel (were breaking things):**
- `GOOGLE_REDIRECT_URI` — NextAuth handles this automatically; hardcoding localhost breaks prod OAuth
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — redundant, code uses server-side `GOOGLE_CLIENT_ID`

## Whop Integration (Phase 4)

**Webhook Handler:** `/api/webhooks/whop`
- Signature verification (HMAC-SHA256)
- Rate limiting (100 req/min per IP)
- Sentry error tracking
- 4 events: payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded
- Auto-creates users, grants access, sends emails
- Idempotency checks, transaction safety

**Testing:** `/api/webhooks/whop/test` (dev), `/api/webhooks/whop/replay/[id]` (admin)
**Validations:** All Zod schemas in `lib/validations.ts`

## Customer Portal (Phase 5)

**Dashboard Routes:** `/dashboard`, `/dashboard/products/[slug]`, `/dashboard/purchases`, `/dashboard/profile`

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

**SEO (already in place):**
- `app/sitemap.ts` — dynamic, includes all products
- `app/robots.ts` — disallows /api/, /dashboard/, /admin/
- Root layout metadata: OG tags, Twitter cards, keywords

## reCAPTCHA Enterprise (Phase 8)

- **Invisible** — no widget rendered, scores silently on form submit
- Script loaded globally in `app/layout.tsx` `<head>`
- Client hook: `hooks/use-recaptcha.ts` → `executeRecaptcha(action)`
- Server utility: `lib/recaptcha.ts` → `verifyRecaptcha(token, action)` — score threshold 0.5, fails open in dev
- **Protected forms:** SIGNUP (`signup`), FORGOT_PASSWORD (`forgot-password`), CONTACT (`contact-form`), NEWSLETTER (`newsletter-form`)
- Each form passes `recaptchaToken` in the POST body; each API route verifies it before processing

## Google OAuth — Known Issues & Fixes

- NextAuth v5 callback path is `/api/auth/callback/google` (NOT `/api/auth/google/callback`)
- Google Cloud Console redirect URIs must match exactly — path order matters
- `signIn` callback fires BEFORE Prisma adapter creates the user row → use `updateMany` not `update`
- App must be **published** in Google Cloud Console OAuth consent screen, not just in testing mode

## Reference Docs

- Main plan: `.claude/plans/dapper-nibbling-mango.md`
- Context: `.claude/project-context.md`
- Sessions: `sessions.md`
