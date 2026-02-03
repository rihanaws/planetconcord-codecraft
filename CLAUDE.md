# CLAUDE.md

## Status: Phase 3 Complete ✅

**Phases Complete:** 1-3 (Foundation, Auth, Public Site) | **Next:** Phase 4 (Whop Integration)

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

## Test Accounts

Admin: admin@techsci.xyz / SecurePassword123!
Customer: customer@example.com / TestPassword123!

## Env Vars

DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, RESEND_API_KEY, WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID

## Reference Docs

- Main plan: `.claude/plans/dapper-nibbling-mango.md`
- Context: `.claude/project-context.md`
- Sessions: `sessions.md`
