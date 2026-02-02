# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Implementation Status

**Phase 1: Foundation & Database Setup** ✅ COMPLETED
- ✅ All dependencies installed (Prisma, NextAuth, Resend, Sentry, etc.)
- ✅ Comprehensive Prisma schema with 8 models created
- ✅ MySQL database connection configured (Prisma 7 + MariaDB adapter)
- ✅ Environment variables set up (.env.example template created)
- ✅ Database seeded with admin user, 6 products, and test customer
- ✅ Git repository initialized and connected to GitHub

**Phase 2: Authentication System** ✅ COMPLETED & ALIGNED
- ✅ NextAuth.js v5 configured with database sessions and Prisma adapter
- ✅ Google OAuth 2.0 integration (OAuth buttons, auto email verification)
- ✅ Email/Password authentication with 6-digit OTP verification (10-min expiry)
- ✅ Password strength validation and bcryptjs hashing (10 rounds)
- ✅ Route protection with proxy.ts (Next.js 16) - role-based access control
- ✅ 5 authentication pages with production-grade UI (login, signup, verify, forgot, reset)
- ✅ 6 reusable auth components extracted (login-form, signup-form, oauth-buttons, etc.)
- ✅ Email service with Resend and 6 React Email templates
- ✅ Session management with AuthProvider and ThemeProvider
- ✅ API routes restructured per plan (register, verify-email with confirm endpoint)
- ✅ All TypeScript and build issues resolved
- ✅ Full alignment with main plan (.claude/plans/dapper-nibbling-mango.md)

**Next Steps:**
- Phase 3: Public Website (Homepage, product pages, legal pages)
- Phase 4: Whop Integration (Webhook handler, payment processing)
- Phase 5: Customer Portal (Dashboard, product access, content delivery)
- Phase 6: Admin Panel (Product management, user management, analytics)
- Phase 7: Polish & Production (Sentry, testing, deployment)

---

## Project Overview

**TechSci CodeCraft Agency** - A production-ready digital product marketplace platform that integrates with Whop for payments, automatically provisions customer access, and provides secure portals for both customers and admins.

- **Domain:** https://codecraft.techsci.xyz
- **Company:** TechSci, Inc. (Delaware Corporation)
- **Purpose:** Demonstrate complete product fulfillment system for Whop business verification
- **Status:** Phase 2 completed & aligned - Authentication system fully operational and production-ready
- **Products:** 6 premium digital products configured and seeded

## Development Commands

```bash
# Development server (http://localhost:3000)
bun dev

# Production build
bun run build

# Start production server
bun start

# Linting
bun run lint

# Database operations
bunx prisma generate                          # Generate Prisma Client
bunx prisma db push                           # Push schema to database (no shadow DB needed)
bun lib/db/seed.ts                            # Seed database with initial data
bunx prisma studio                            # Open database GUI
bunx prisma migrate dev --name name           # Create migration (requires shadow DB permissions)
bunx prisma migrate deploy                    # Deploy to production
bunx prisma migrate reset                     # Reset database (deletes all data)
```

## Tech Stack Architecture

### Core Framework
- **Next.js 16.1.6** with App Router (uses `proxy.ts`, NOT `middleware.ts`)
- **React 19.2.3** with Server Components by default
- **TypeScript 5.x** with strict mode
- **Bun** as package manager and runtime

### Styling & UI
- **Tailwind CSS v4** - CSS-first configuration (NO `tailwind.config.ts` file)
- **shadcn/ui** (new-york style, neutral theme)
- **Framer Motion** for animations
- **Lucide React** for icons
- **next-themes** for dark mode

### Database & ORM
- **MySQL** hosted on Hostinger
  - Host: `srv1833.hstgr.io` (IP: 193.203.184.211)
  - Database: `u646485450_codecraftagent`
  - Port: 3306
- **Prisma ORM 7.3.0** with @prisma/adapter-mariadb for MySQL connections
- **prisma.config.ts** for Prisma 7 datasource configuration

### Authentication
- **NextAuth.js v5** with database sessions (Prisma adapter)
- **Google OAuth 2.0** for social login (auto email verification)
- **Email/Password** with 6-digit OTP verification (10-min expiry)
- **bcryptjs** for password hashing (10 rounds)

### Integrations
- **Whop** - Payment processing and webhook integration
- **Resend** - Transactional emails (OTP, confirmations, notifications)

## Critical Architecture Notes

### Next.js 16 Breaking Change
**IMPORTANT:** Next.js 16 renamed `middleware.ts` to `proxy.ts`
- ✅ Create `proxy.ts` in root directory for route protection
- ❌ DO NOT create `middleware.ts` (deprecated in Next.js 16)

### Tailwind CSS v4
- NO `tailwind.config.ts` file needed
- CSS-first configuration in `app/globals.css`
- Theme uses CSS custom properties with OKLCH color space
- Custom radius variables (`--radius-sm` through `--radius-4xl`)

### Path Aliases
```typescript
// All paths use @/* alias mapping to root
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

## Key Application Flow

```
Customer Journey:
Public Site → Browse Products → Whop Checkout → Payment Success →
Whop Webhook → Auto-Create User Account → Grant Product Access →
Email Notification → Customer Login → Dashboard → Access Content

Admin Journey:
Admin Login → Admin Panel → Manage Products/Users/Access →
Monitor Webhooks → View Analytics
```

## Database Architecture

### Core Models
- **User** - Customers and admins (Google OAuth or email/password)
- **Product** - 6 digital products with pricing and Whop integration
- **ProductAccess** - Junction table tracking who can access what
- **Purchase** - Payment records from Whop webhooks
- **ContentItem** - Digital content (files, links, text, videos)
- **VerificationToken** - OTP codes for email verification
- **WebhookLog** - Debug log for Whop webhook events
- **Account/Session** - NextAuth.js tables

### Key Relationships
- User ↔ many ProductAccess ↔ many Products
- User ↔ many Purchases
- Product ↔ many ContentItems

## Whop Integration

### Webhook Events (`/api/webhooks/whop`)
- `payment.succeeded` → Create user + grant access + send email
- `membership.went_valid` → Activate subscription
- `membership.went_invalid` → Expire subscription
- `payment.refunded` → Revoke access

### Security
- Verify webhook signature with `WHOP_WEBHOOK_SECRET`
- Validate payloads with Zod schemas
- Idempotency checks to prevent duplicate processing
- Log all webhooks for debugging

## Authentication System

### Methods
1. **Google OAuth** - Auto-create accounts via NextAuth
2. **Email/Password** - Requires 6-digit OTP verification (10-min expiry)

### User Roles
- `CUSTOMER` (default) - Access dashboard and purchased products
- `ADMIN` - Full admin panel access

### Route Protection (proxy.ts)
- Public routes: `/`, `/products/*`, `/login`, `/signup`
- Protected routes: `/dashboard/*` (requires authentication)
- Admin routes: `/admin/*` (requires ADMIN role)

## Email System (Resend)

Transactional emails sent from `noreply@techsci.xyz` using React Email templates:

**6 Email Templates** (`lib/email/templates/`):
1. `verification-otp.tsx` - 6-digit OTP for email verification
2. `welcome.tsx` - Welcome message for new users
3. `purchase-confirmation.tsx` - Order confirmation after payment
4. `access-granted.tsx` - Product access notification
5. `password-reset.tsx` - Password reset OTP code
6. `subscription-expiring.tsx` - Renewal reminder for subscriptions

All templates use consistent branding and are fully responsive.

## Project Structure

```
techsci-codecraft/
├── proxy.ts                    # Route protection (NOT middleware.ts)
├── app/
│   ├── layout.tsx              # Root layout with Geist fonts
│   ├── page.tsx                # Public homepage
│   ├── globals.css             # Tailwind v4 config + theme variables
│   ├── (auth)/                 # Auth pages (login, signup, verify, reset)
│   ├── (public)/               # Public pages (products, about, legal)
│   ├── (dashboard)/dashboard/  # Customer portal (protected)
│   ├── (admin)/admin/          # Admin panel (admin only)
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/      # NextAuth handlers
│       │   ├── register/           # User registration
│       │   ├── forgot-password/    # Password reset request
│       │   └── reset-password/     # Password reset with OTP
│       ├── verify-email/
│       │   ├── route.ts            # Send OTP
│       │   └── confirm/route.ts    # Verify OTP
│       ├── webhooks/whop/          # Whop webhook handler
│       └── [products, access]/     # API routes
├── components/
│   ├── ui/                     # shadcn/ui components (managed via CLI)
│   ├── auth/                   # 6 reusable auth components
│   │   ├── oauth-buttons.tsx       # Google OAuth button
│   │   ├── login-form.tsx          # Email/password login
│   │   ├── signup-form.tsx         # Registration form
│   │   ├── verify-otp-form.tsx     # OTP verification
│   │   ├── forgot-password-form.tsx # Password reset request
│   │   └── reset-password-form.tsx  # New password form
│   ├── layout/                 # Headers, footers, nav, auth-provider
│   ├── dashboard/              # Customer portal components
│   ├── admin/                  # Admin panel components
│   └── products/               # Product display components
├── lib/
│   ├── auth/                   # NextAuth config & utilities
│   ├── db/                     # Prisma client & seed script
│   ├── email/                  # Email templates & send utilities
│   ├── whop/                   # Webhook handler & signature verification
│   ├── utils.ts                # cn() helper for Tailwind
│   └── [validations, types, constants]
└── prisma/
    ├── schema.prisma           # Database schema
    └── migrations/             # Database migrations
```

## Design Philosophy

### Consistency is Critical
**Every page must feel like part of the same platform:**
- Same color palette across ALL pages
- Same typography (fonts, sizes, weights)
- Same spacing system (padding, margins)
- Same component styling (buttons, cards, forms)
- Same navigation design
- Same animations and transitions

**Design once, apply everywhere. No page should feel different.**

### Inspiration
- Linear (clean, modern SaaS)
- Stripe Dashboard (professional, trustworthy)
- Vercel Dashboard (fast, intuitive)
- Whop (product-focused, clear)

## Products Being Sold

1. **Email Newsletter Starter Pack** - $149 (marketing)
2. **Landing Page CRO Boost** - $597 (marketing)
3. **Social Media Content Calendar** - $199 (marketing)
4. **Growth Accelerator Package** - $599.67/mo (marketing)
5. **RealEstate AI Video Review** - $29.99/mo (analytics)
6. **Shopify Speed Surge** - $500 (development)

## Common Development Patterns

### Component Development
- Server Components by default
- Use `"use client"` only for hooks, events, browser APIs
- shadcn/ui components in `/components/ui` should not be manually edited

### Styling
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Leverage CSS variables for colors (`bg-background`, `text-foreground`)
- Both light and dark mode fully configured via CSS variables

### Forms
- Use `react-hook-form` with `zod` validation
- Import resolvers from `@hookform/resolvers/zod`

### Database Operations
- Always use Prisma Client from `@/lib/db/prisma`
- **Prisma 7 with MariaDB adapter** required for MySQL connections
- Two Prisma clients exported: `prisma` (with adapter) and `prismaForAuth` (for NextAuth compatibility)
- Use transactions for multi-step operations
- Handle errors gracefully with try-catch

### React Server Components & Client Components
- **Pages with `useSearchParams()`** must be wrapped in Suspense boundaries
- Example: Login, verify-email, reset-password pages all use Suspense
- Server Components by default; use `"use client"` only when needed

## Critical Requirements

### Must Work Perfectly
- Google OAuth login flow
- Email/password signup with OTP verification
- Whop webhook processing (signature verification)
- Automatic access provisioning after purchase
- Customer portal access control via `proxy.ts`
- Secure content delivery
- Admin panel functionality
- Email notifications via Resend
- Mobile responsive design
- CONSISTENT design across ALL pages

### Common Mistakes to Avoid
- ❌ Creating `middleware.ts` (use `proxy.ts` in Next.js 16)
- ❌ Creating `tailwind.config.ts` (Tailwind v4 doesn't need it)
- ❌ Storing plain text passwords
- ❌ Skipping webhook signature verification
- ❌ Exposing admin routes to customers
- ❌ Using `any` type in TypeScript (except for known library compatibility issues)
- ❌ Using `error.errors` with Zod (correct: `error.issues`)
- ❌ Forgetting Suspense boundaries for `useSearchParams()` pages
- ❌ Using string literals for Prisma enums (use `PricingType.ONE_TIME`, not `"ONE_TIME"`)
- ❌ Inconsistent design across pages
- ❌ Different styling on different pages

## Environment Variables

Required variables in `.env.local`:
```env
DATABASE_URL=postgresql://u646485450_codecraftagent:S5ICjW1CPHL@r**m@srv1833.hstgr.io:5432/u646485450_codecraftagent
NEXTAUTH_URL=https://codecraft.techsci.xyz
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
RESEND_API_KEY=<from resend.com>
RESEND_FROM_EMAIL=noreply@techsci.xyz
WHOP_WEBHOOK_SECRET=<from Whop dashboard>
WHOP_API_KEY=apik_3VJMa9g5TlXnC_C4051472_C_74f9d412eadda122b0c7805d2703242ae6aaedb6817f53c68b3b7e694aba2a
WHOP_COMPANY_ID=biz_DVtB8NOUFdLlX0
```

## Testing

### Test Accounts
```
Admin:
Email: admin@techsci.xyz
Password: SecurePassword123!

Customer:
Email: customer@example.com
Has access to: Email Newsletter Starter Pack
```

### Key Test Scenarios
- Sign up with Google OAuth
- Sign up with email/password + OTP
- Simulate Whop webhook (payment.succeeded)
- Verify auto-account creation and access grant
- Customer dashboard shows purchased products
- Admin can manage products, users, access
- Route protection via `proxy.ts` works correctly

## Deployment

- **Platform:** Vercel
- **Database:** Hostinger PostgreSQL (already configured)
- **Domain:** codecraft.techsci.xyz
- **SSL:** Automatic via Vercel

## Recent Updates & Corrections

**Phase 2 Corrections Completed** (2026-02-02):
- ✅ Restructured API routes to match plan exactly
- ✅ Created 6 reusable auth components
- ✅ Moved auth provider to `components/layout/auth-provider.tsx`
- ✅ Fixed all TypeScript and build issues
- ✅ Added Suspense boundaries for client components
- ✅ Fixed Zod error handling across all API routes
- ✅ Fixed Prisma 7 adapter configuration for MySQL

See `PHASE2_CORRECTIONS.md` for detailed change log.

## Additional Context

For detailed product specifications, business requirements, and implementation checklists, see:
- `.claude/project-context.md` - Complete mission and architecture
- `.claude/project-readme.md` - Comprehensive technical documentation
- `.claude/plans/dapper-nibbling-mango.md` - Main implementation plan
- `PHASE2_CORRECTIONS.md` - Phase 2 corrections and alignment details
