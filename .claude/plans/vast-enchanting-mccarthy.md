# TechSci CodeCraft - Complete Digital Product Marketplace Implementation Plan

## Executive Summary

Building a production-ready digital product marketplace with Whop payment integration, automated customer access provisioning, and comprehensive admin management. The platform sells 6 digital marketing/development products and demonstrates complete fulfillment capability for Whop business verification.

**Current Status**: Foundation only (Next.js 16, Tailwind v4, 15 Shadcn components, form libraries)
**Target**: Full-featured marketplace with auth, payments, customer portal, admin panel
**Approach**: Production-ready from start with full implementation

---

## Tech Stack Decisions

### Core

- **Framework**: Next.js 16.1.6 (App Router) ✅
- **Database**: PostgreSQL (Hostinger) + Prisma ORM
- **Auth**: NextAuth.js v5 (Google OAuth + Email/Password with OTP)
- **Payments**: Whop integration with manual webhook verification
- **Styling**: Tailwind CSS v4 (CSS-first) ✅ + Shadcn/UI ✅

### Infrastructure

- **File Storage**: Vercel Blob Storage
- **Email**: Resend with React Email + Tailwind templates
- **Monitoring**: Sentry (DSN configured) + Vercel Analytics
- **Security**: Rate limiting, CSRF protection, input sanitization, bcrypt

### Testing & Quality

- **Testing**: Automated tests for critical paths (auth, webhooks, payments)
- **Observability**: Full error tracking + performance monitoring
- **Priorities**: Performance, Security, Mobile-first, SEO

---

## Design Philosophy

### Visual Identity

**Professional SaaS with Trustworthy Appeal** (optimized for Whop business verification)

**Color Palette** (Light mode primary):

- Primary: Deep blue (#0F172A) - Trust, professionalism
- Accent: Vibrant purple (#8B5CF6) - Modern, tech-forward
- Success: Emerald (#10B981) - Positive actions
- Background: Clean whites/grays (#FFFFFF, #F8FAFC)
- Text: Slate scale (#334155, #64748B, #94A3B8)

**Dark Mode**: Inverted with purple accents for modern SaaS feel

**Typography**:

- Headings: Geist Sans (600/700 weight)
- Body: Geist Sans (400/500 weight)
- Code: Geist Mono

**Inspiration**: Stripe Dashboard (trust) + Linear (modern) + Whop (product-focused)

### Consistency Requirements

✅ Same color palette across ALL pages
✅ Identical component styling (buttons, cards, forms)
✅ Consistent spacing system (4/8/12/16/24/32/48px scale)
✅ Matching animations (200ms transitions, subtle hover effects)
✅ Unified navigation patterns

---

## Critical Implementation Notes

### Next.js 16 Changes

- ✅ Use `proxy.ts` for route protection (NOT `middleware.ts`)
- ✅ Tailwind v4 has NO `tailwind.config.ts` (CSS-only in globals.css)

### Database Connection

```
Host: srv1833.hstgr.io (193.203.184.211)
Database: u646485450_codecraftagent
User: u646485450_codecraftagent
Password: S5ICjW1CPHL@r**m
Port: 5432
```

### Sentry Configuration

```
DSN: https://442166e17691fd58f8782dfc84d4fb4e@o4507587199369216.ingest.us.sentry.io/4510817057570816
```

Follow `.cursor/rules/rules.md` patterns:

- Client: `instrumentation-client.ts`
- Server: `sentry.server.config.ts`
- Edge: `sentry.edge.config.ts`
- Use spans for meaningful actions
- Enable logs with `enableLogs: true`

---

## Implementation Phases

### PHASE 1: Foundation & Database Setup

**Duration**: Day 1-2
**Status**: Foundation exists, need database layer

#### 1.1 Install Dependencies

```bash
# Prisma ORM
bun add prisma @prisma/client
bun add -D prisma

# NextAuth.js v5
bun add next-auth@beta @auth/prisma-adapter @auth/core

# Password & Utilities
bun add bcryptjs nanoid date-fns
bun add -D @types/bcryptjs

# Vercel Blob Storage
bun add @vercel/blob

# React Email
bun add react-email @react-email/components
bun add -D @react-email/render

# Sentry
bun add @sentry/nextjs

# Rate Limiting
bun add @upstash/ratelimit @upstash/redis

# Additional Shadcn Components
bunx --bun shadcn@latest add avatar checkbox table form popover command alert toast
```

#### 1.2 Database Schema (`prisma/schema.prisma`)

Create complete schema with models:

- User (id, email, password, role, emailVerified, image)
- Account, Session (NextAuth tables)
- VerificationToken (OTP codes, password resets)
- Product (6 digital products with full details)
- ProductAccess (junction table: userId + productId + status)
- Purchase (payment records from Whop)
- ContentItem (digital deliverables: files, links, text, videos)
- WebhookLog (debugging Whop webhooks)

**Enums**: UserRole, TokenType, PricingType, AccessType, AccessStatus, PurchaseStatus, ContentType

#### 1.3 Initialize Database

```bash
# Initialize Prisma
bunx prisma init

# Create migration
bunx prisma migrate dev --name init

# Generate client
bunx prisma generate
```

#### 1.4 Database Utilities

- `lib/db/prisma.ts` - Singleton Prisma client with connection pooling
- `lib/db/seed.ts` - Seed admin user, 6 products, test customer

#### 1.5 Environment Setup

Create `.env.local` with all required variables:

- DATABASE_URL (Hostinger PostgreSQL)
- NEXTAUTH_URL, NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- RESEND_API_KEY, RESEND_FROM_EMAIL
- WHOP_WEBHOOK_SECRET, WHOP_API_KEY, WHOP_COMPANY_ID
- BLOB_READ_WRITE_TOKEN (Vercel Blob)
- SENTRY_DSN
- ADMIN_EMAIL, CONTACT_EMAIL

Create `.env.example` template for documentation.

#### 1.6 Sentry Setup

Following `.cursor/rules/rules.md` patterns:

- `instrumentation-client.ts` - Client-side init with DSN
- `sentry.server.config.ts` - Server-side init
- `sentry.edge.config.ts` - Edge runtime init
- Enable logs, console integration
- Configure spans for critical operations

**Critical Files**:

- `prisma/schema.prisma`
- `lib/db/prisma.ts`
- `lib/db/seed.ts`
- `.env.local`, `.env.example`
- `instrumentation-client.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

---

### PHASE 2: Authentication System

**Duration**: Day 2-3
**Focus**: NextAuth.js v5 with Google OAuth + Email/Password + OTP

#### 2.1 NextAuth Configuration

- `lib/auth/config.ts` - Complete NextAuth config
  - Google OAuth provider
  - Credentials provider (email/password)
  - Database adapter (Prisma)
  - Session strategy: database
  - Callbacks: jwt, session, signIn

- `app/api/auth/[...nextauth]/route.ts` - NextAuth route handlers

#### 2.2 Authentication Utilities

- `lib/auth/utils.ts`:
  - Password hashing (bcrypt, 10 rounds)
  - OTP generation (6-digit codes)
  - Email verification helpers
  - Session helpers
  - Role-based access control utilities

#### 2.3 Email Service

- `lib/email/send.ts` - Resend integration wrapper
- `lib/email/templates/` (React Email):
  - `verification-otp.tsx` - 6-digit OTP code
  - `welcome.tsx` - Welcome email
  - `purchase-confirmation.tsx` - Purchase details
  - `access-granted.tsx` - Product access notification
  - `password-reset.tsx` - Reset link
  - `subscription-expiring.tsx` - Renewal reminder

All templates styled with Tailwind, consistent branding.

#### 2.4 Auth API Routes

- `app/api/verify-email/route.ts` - Send OTP
- `app/api/verify-email/confirm/route.ts` - Verify OTP
- `app/api/auth/register/route.ts` - Email/password signup
- `app/api/auth/forgot-password/route.ts` - Request reset
- `app/api/auth/reset-password/route.ts` - Complete reset

All with Zod validation, rate limiting, Sentry error tracking.

#### 2.5 Auth Pages (Route Group: `app/(auth)/`)

- `/login/page.tsx` - Login form with Google OAuth button
- `/signup/page.tsx` - Signup form with password validation
- `/verify-email/page.tsx` - OTP verification form
- `/forgot-password/page.tsx` - Request reset form
- `/reset-password/[token]/page.tsx` - Reset password form

#### 2.6 Auth Components

- `components/auth/login-form.tsx` - Email/password login
- `components/auth/signup-form.tsx` - Registration form
- `components/auth/oauth-buttons.tsx` - Google OAuth button
- `components/auth/verify-otp-form.tsx` - 6-digit OTP input
- `components/auth/forgot-password-form.tsx` - Request reset
- `components/auth/reset-password-form.tsx` - New password input

All with react-hook-form + Zod validation, loading states, error handling.

#### 2.7 Route Protection (`proxy.ts`)

Create Next.js 16 proxy for route protection:

- Public routes: `/`, `/products/*`, `/login`, `/signup`, `/verify-email`, legal pages
- Protected routes: `/dashboard/*` → redirect to `/login` if unauthenticated
- Admin routes: `/admin/*` → redirect to `/dashboard` if not admin role
- API protection: Admin-only routes, webhook signature verification

#### 2.8 Auth Provider

- `components/layout/auth-provider.tsx` - SessionProvider wrapper
- `app/layout.tsx` - Wrap app with auth provider

**Critical Files**:

- `lib/auth/config.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `proxy.ts`
- `lib/email/send.ts`
- `lib/email/templates/*.tsx` (6 templates)
- `app/(auth)/**/page.tsx` (5 pages)
- `components/auth/*.tsx` (6 components)

---

### PHASE 3: Public Website

**Duration**: Day 3-4
**Focus**: Homepage, product pages, legal pages (consistent design)

#### 3.1 Public Layout & Navigation

- `components/layout/header.tsx` - Public header
  - Logo, nav menu (Products, About, Contact)
  - Login/Signup buttons
  - Dark mode toggle
  - Mobile hamburger menu

- `components/layout/footer.tsx` - Site footer
  - Links (Products, About, Terms, Privacy, Refund, Contact)
  - Copyright, social links
  - Newsletter signup form

- `components/layout/mobile-menu.tsx` - Mobile navigation drawer

#### 3.2 Homepage (`app/page.tsx`)

Sections:

- **Hero**: Headline, subheading, CTA buttons
- **Features**: 4-6 key benefits with icons
- **Products**: Featured products grid (3 cards)
- **Social Proof**: Testimonials or trust badges
- **FAQ**: Common questions accordion
- **CTA**: Final conversion section

Components:

- `components/sections/hero.tsx`
- `components/sections/features.tsx`
- `components/sections/testimonials.tsx`
- `components/sections/faq.tsx`
- `components/sections/cta.tsx`
- `components/sections/trust-badges.tsx`

#### 3.3 Product Pages (Route Group: `app/(public)/products/`)

- `/products/page.tsx` - Product listing
  - Grid of all 6 products
  - Category filters (Marketing, Analytics, Development)
  - Search bar
  - Sorting (price, popularity)

- `/products/[slug]/page.tsx` - Product detail
  - Product hero (name, price, image)
  - Full description
  - Deliverables list
  - Features checklist
  - Requirements
  - FAQ accordion
  - "Buy Now" button → Redirect to Whop checkout

Components:

- `components/products/product-card.tsx` - Grid item
- `components/products/product-grid.tsx` - Grid layout
- `components/products/product-filter.tsx` - Category/search filters
- `components/products/product-hero.tsx` - Detail page hero
- `components/products/product-features.tsx` - Features section
- `components/products/product-faq.tsx` - FAQ section

#### 3.4 Other Public Pages (`app/(public)/`)

- `/about/page.tsx` - About TechSci CodeCraft Agency
- `/contact/page.tsx` - Contact form (sends via Resend)
- `/terms/page.tsx` - Terms of Service
- `/privacy/page.tsx` - Privacy Policy
- `/refund/page.tsx` - Refund Policy

#### 3.5 Product Data & Utilities

- `lib/products.ts` - Product data helpers
  - getAllProducts()
  - getProductBySlug(slug)
  - getFeaturedProducts()
  - getProductsByCategory(category)

- `lib/constants.ts` - Site configuration
  - Site name, URLs
  - Contact emails
  - Social links
  - Product categories

#### 3.6 Forms

- `components/forms/contact-form.tsx` - Contact page form
- `components/forms/newsletter-form.tsx` - Newsletter signup (footer)

Both with validation, rate limiting, Sentry tracking.

#### 3.7 SEO & Metadata

- Dynamic metadata for all pages
- OG images for social sharing
- Structured data (JSON-LD) for products
- Sitemap generation

**Critical Files**:

- `components/layout/header.tsx`, `footer.tsx`
- `app/page.tsx` (homepage)
- `app/(public)/products/page.tsx`, `[slug]/page.tsx`
- `app/(public)/{about,contact,terms,privacy,refund}/page.tsx`
- `components/products/*.tsx` (6 components)
- `components/sections/*.tsx` (6 sections)
- `lib/products.ts`, `lib/constants.ts`

---

### PHASE 4: Whop Integration

**Duration**: Day 4-5
**Focus**: Webhook handler, payment processing, access provisioning

#### 4.1 Webhook Handler (`app/api/webhooks/whop/route.ts`)

POST endpoint for Whop webhooks:

- Verify webhook signature (HMAC-SHA256 with WHOP_WEBHOOK_SECRET)
- Validate payload with Zod schema
- Idempotency check (by whopPaymentId)
- Route events to handlers
- Log all webhooks to WebhookLog table
- Rate limiting
- Sentry error tracking

#### 4.2 Webhook Signature Verification

- `lib/whop/verify-signature.ts`:
  - Extract signature from headers
  - Compute HMAC with crypto.createHmac
  - Constant-time comparison
  - Return boolean

#### 4.3 Event Handlers (`lib/whop/webhook-handler.ts`)

**payment.succeeded**:

1. Extract: email, productId, paymentId, amount
2. Find or create User by email
3. Create Purchase record
4. Grant ProductAccess (status: ACTIVE)
5. Send "Access Granted" email
6. Log success

**membership.went_valid**:

1. Find ProductAccess by whopMembershipId
2. Update status to ACTIVE
3. Set expiresAt based on billing period
4. Send notification

**membership.went_invalid**:

1. Find ProductAccess by whopMembershipId
2. Update status to EXPIRED
3. Set revokedAt timestamp
4. Send notification

**payment.refunded**:

1. Find Purchase by whopPaymentId
2. Update Purchase status to REFUNDED
3. Revoke ProductAccess (status: REVOKED)
4. Send notification

All handlers wrapped in database transactions with Sentry spans.

#### 4.4 Validation Schemas

- `lib/validations.ts`:
  - Whop webhook payload schemas (Zod)
  - Payment event schema
  - Membership event schema
  - User input schemas

#### 4.5 Testing Utilities

- Create test webhook payload generator
- Manual trigger endpoint (dev only)
- Webhook replay functionality (admin)

**Critical Files**:

- `app/api/webhooks/whop/route.ts`
- `lib/whop/verify-signature.ts`
- `lib/whop/webhook-handler.ts`
- `lib/validations.ts`

---

### PHASE 5: Customer Portal (Dashboard)

**Duration**: Day 5-6
**Focus**: Protected customer area for accessing purchased products

#### 5.1 Dashboard Layout (`app/(dashboard)/dashboard/layout.tsx`)

- Sidebar navigation (collapsible on mobile)
  - Dashboard, My Products, Purchases, Profile
- Top bar with user menu, notifications
- Logout button
- Responsive design

Components:

- `components/layout/dashboard-header.tsx`
- `components/layout/dashboard-sidebar.tsx`
- `components/layout/user-menu.tsx`

#### 5.2 Dashboard Home (`app/(dashboard)/dashboard/page.tsx`)

Sections:

- Welcome message with user name
- Quick stats (products owned, active subscriptions, total spent)
- My Products grid (ProductAccess cards)
- Recent purchases table
- Empty states with helpful CTAs

Components:

- `components/dashboard/stats-cards.tsx`
- `components/dashboard/product-access-card.tsx`
- `components/dashboard/recent-purchases.tsx`

#### 5.3 Product Access Page (`app/(dashboard)/dashboard/products/[slug]/page.tsx`)

- Verify user has active ProductAccess
- Display product name, description
- Content sections (organized by type):
  - Files: Download buttons (via Vercel Blob)
  - Links: External resource links
  - Text: Rich text display (markdown)
  - Videos: Embedded players (YouTube, Vimeo)
- Access status indicator
- Expiration warning (for subscriptions)

Components:

- `components/dashboard/content-viewer.tsx`
- `components/dashboard/content-item-file.tsx`
- `components/dashboard/content-item-link.tsx`
- `components/dashboard/content-item-text.tsx`
- `components/dashboard/content-item-video.tsx`

#### 5.4 Purchase History (`app/(dashboard)/dashboard/purchases/page.tsx`)

- Table with columns: Date, Product, Amount, Status, Invoice
- Filters: Status (Completed, Pending, Refunded), Date range
- Search by product name
- Pagination
- Export to CSV

Components:

- `components/dashboard/purchase-history-table.tsx`
- `components/dashboard/purchase-filters.tsx`

#### 5.5 Profile Management (`app/(dashboard)/dashboard/profile/page.tsx`)

Sections:

- **Profile Info**: Edit name, upload avatar (Vercel Blob)
- **Account Security**: Change password (require current password)
- **Email Settings**: Change email (require verification)
- **Connected Accounts**: Show OAuth providers
- **Danger Zone**: Delete account (confirmation dialog)

Components:

- `components/dashboard/profile-form.tsx`
- `components/dashboard/password-change-form.tsx`
- `components/dashboard/avatar-upload.tsx`

API Routes:

- `app/api/user/profile/route.ts` - Update profile
- `app/api/user/password/route.ts` - Change password
- `app/api/user/avatar/route.ts` - Upload avatar

#### 5.6 Access Control

- All pages verify authentication via proxy.ts
- Check ProductAccess status before showing content
- Handle expired subscriptions gracefully
- Redirect to purchase page if no access

**Critical Files**:

- `app/(dashboard)/dashboard/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/products/[slug]/page.tsx`
- `app/(dashboard)/dashboard/purchases/page.tsx`
- `app/(dashboard)/dashboard/profile/page.tsx`
- `components/dashboard/*.tsx` (10+ components)
- `components/layout/dashboard-*.tsx` (3 components)

---

### PHASE 6: Admin Panel

**Duration**: Day 6-7
**Focus**: Comprehensive management interface (admin role only)

#### 6.1 Admin Layout (`app/(admin)/admin/layout.tsx`)

- Sidebar navigation (Dashboard, Products, Users, Purchases, Access, Webhooks)
- Top bar with admin badge
- Logout button
- Responsive design (same pattern as customer dashboard)

#### 6.2 Admin Dashboard (`app/(admin)/admin/page.tsx`)

Analytics overview:

- Total revenue (all time, this month)
- Active customers count
- Product sales breakdown (chart)
- Recent purchases table (last 10)
- Recent webhook events (last 10)
- Quick actions (Create Product, Grant Access, View Logs)

Components:

- `components/admin/analytics-cards.tsx`
- `components/admin/revenue-chart.tsx`
- `components/admin/recent-activity.tsx`

#### 6.3 Product Management (`app/(admin)/admin/products/`)

- `/products/page.tsx` - Product list table
  - All products with actions (Edit, Delete, View)
  - Create new product button
  - Search and filters

- `/products/new/page.tsx` - Create product form
  - All fields: name, slug, description, price, pricingType, category
  - Whop integration: productId, checkoutUrl
  - Deliverables, features, requirements, FAQ (JSON editors)
  - Image upload (Vercel Blob)
  - Featured/popular flags

- `/products/[id]/edit/page.tsx` - Edit product form
  - Same as create, pre-populated

- `/products/[id]/content/page.tsx` - Manage content items
  - Add/edit/delete content items
  - File uploads (Vercel Blob)
  - External links
  - Text content (markdown editor)
  - Video embeds
  - Reorder content

Components:

- `components/admin/product-form.tsx`
- `components/admin/product-table.tsx`
- `components/admin/content-item-form.tsx`
- `components/admin/content-item-list.tsx`

API Routes:

- `app/api/admin/products/route.ts` - CRUD operations
- `app/api/admin/products/[id]/route.ts` - Single product
- `app/api/admin/content/route.ts` - Content CRUD

#### 6.4 User Management (`app/(admin)/admin/users/page.tsx`)

- Table: All users with search/filters
- Columns: Name, Email, Role, Verified, Created, Actions
- Actions: Edit role, View purchases, View access, Deactivate
- User detail modal: Full profile + purchases + access

Components:

- `components/admin/user-table.tsx`
- `components/admin/user-detail-modal.tsx`

API Routes:

- `app/api/admin/users/route.ts` - List users
- `app/api/admin/users/[id]/route.ts` - Update user

#### 6.5 Access Management (`app/(admin)/admin/access/page.tsx`)

Features:

- **Grant Access**: Select user, product, access type, expiration
- **Revoke Access**: Select access record, provide reason
- **Bulk Operations**: Grant to multiple users, export access list
- **Access Table**: All ProductAccess records with filters

Components:

- `components/admin/access-management.tsx`
- `components/admin/grant-access-dialog.tsx`
- `components/admin/revoke-access-dialog.tsx`
- `components/admin/access-table.tsx`

API Routes:

- `app/api/admin/access/grant/route.ts` - Grant access
- `app/api/admin/access/revoke/route.ts` - Revoke access
- `app/api/admin/access/route.ts` - List all access

#### 6.6 Purchase Management (`app/(admin)/admin/purchases/page.tsx`)

- Table: All purchases with filters
- Columns: Date, User, Product, Amount, Status, Whop ID, Actions
- Filters: Status, date range, product
- Manual status updates
- Export to CSV

Components:

- `components/admin/purchase-table.tsx`
- `components/admin/purchase-filters.tsx`

#### 6.7 Webhook Logs (`app/(admin)/admin/webhooks/page.tsx`)

- Table: All webhook events
- Columns: Event, Timestamp, Processed, Error, Actions
- View full payload (JSON viewer)
- Retry failed webhooks
- Export logs

Components:

- `components/admin/webhook-log-table.tsx`
- `components/admin/webhook-detail-modal.tsx`

API Routes:

- `app/api/admin/webhooks/route.ts` - List logs
- `app/api/admin/webhooks/[id]/retry/route.ts` - Retry webhook

#### 6.8 Security

- All admin routes protected by proxy.ts (admin role check)
- All API routes verify admin role
- Audit logging for sensitive actions
- Rate limiting on write operations

**Critical Files**:

- `app/(admin)/admin/layout.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/products/**/*.tsx` (4 pages)
- `app/(admin)/admin/{users,purchases,access,webhooks}/page.tsx`
- `components/admin/*.tsx` (15+ components)
- `app/api/admin/**/*.ts` (10+ routes)

---

### PHASE 7: Polish & Production

**Duration**: Day 7-8
**Focus**: Optimization, testing, deployment

#### 7.1 Design Consistency Audit

- Verify color palette consistency across ALL pages
- Check component styling uniformity
- Validate spacing system adherence
- Test animations across site
- Mobile responsiveness check (all pages)

#### 7.2 Performance Optimization

- Image optimization (next/image)
- Lazy loading (dynamic imports)
- Code splitting (route-based)
- Bundle analysis (analyze script)
- Lighthouse audit (target 90+)
- Database query optimization (indexes, N+1)

#### 7.3 Security Hardening

- Rate limiting on all API routes (@upstash/ratelimit)
- CSRF protection (built-in Next.js)
- Input sanitization (all forms)
- SQL injection prevention (Prisma parameterization)
- XSS prevention (React auto-escape)
- Secure headers (next.config.ts)
- Environment variable validation (t3-env or zod)

#### 7.4 SEO Optimization

- Metadata for all pages (Next.js Metadata API)
- OG images (dynamic generation)
- Structured data (JSON-LD for products)
- Sitemap (`app/sitemap.ts`)
- Robots.txt (`app/robots.ts`)
- Canonical URLs

#### 7.5 Error Handling

- Error boundaries for all route groups
- Custom 404 page (`app/not-found.tsx`)
- Custom 500 page (`app/error.tsx`)
- Toast notifications (Sonner) for all actions
- Sentry error tracking (all errors)
- User-friendly error messages

#### 7.6 Testing

**Automated Tests** (Vitest + Playwright):

- Auth flows: Signup, login, OTP verification, password reset
- Webhook processing: All 4 event types
- Access control: Route protection, role checks
- Critical API routes: Product CRUD, access grant/revoke

**Manual Testing**:

- Complete user journey (signup → purchase simulation → access content)
- Admin panel functionality (all CRUD operations)
- Mobile responsiveness (all pages)
- Cross-browser testing (Chrome, Safari, Firefox)
- Email delivery (all templates)

#### 7.7 Documentation

- Update README.md with:
  - Setup instructions
  - Environment variables guide
  - Database setup
  - Deployment guide
  - API documentation
- Create API documentation (Swagger/OpenAPI)
- Admin user guide
- Customer user guide

#### 7.8 Deployment (Vercel)

1. Connect GitHub repository
2. Configure environment variables (production)
3. Setup Google OAuth (production redirect URIs)
4. Configure Whop webhook URL (production)
5. Setup Vercel Blob Storage
6. Enable Vercel Analytics
7. Deploy to production
8. Run database migrations (bunx prisma migrate deploy)
9. Seed production database (admin user + 6 products)
10. Test all flows in production

#### 7.9 Google OAuth Production Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Authorized origins: `https://codecraft.techsci.xyz`
4. Authorized redirect URI: `https://codecraft.techsci.xyz/api/auth/callback/google`
5. Add credentials to Vercel environment variables

#### 7.10 Whop Production Setup

1. Go to Whop Dashboard
2. Add webhook endpoint: `https://codecraft.techsci.xyz/api/webhooks/whop`
3. Select events: payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded
4. Copy webhook secret to Vercel environment variables
5. Test with Whop test mode

#### 7.11 Final Verification

- [ ] All authentication flows work
- [ ] Google OAuth redirects correctly
- [ ] Email verification sends OTPs
- [ ] Whop webhooks process successfully
- [ ] Customer portal shows products
- [ ] Content access works (files download, links open)
- [ ] Admin panel fully functional
- [ ] All forms validate correctly
- [ ] Mobile responsive on all pages
- [ ] Lighthouse score 90+ (performance, accessibility, best practices, SEO)
- [ ] No console errors or warnings
- [ ] Sentry capturing errors
- [ ] Vercel Analytics tracking pageviews

**Critical Files**:

- `app/sitemap.ts`, `app/robots.ts`
- `app/not-found.tsx`, `app/error.tsx`
- `next.config.ts` (security headers)
- Test files (Vitest + Playwright)
- Updated README.md

---

## Database Seed Data

### Admin User

```typescript
{
  email: "admin@techsci.xyz",
  password: "SecurePassword123!" // hashed
  role: "ADMIN",
  emailVerified: new Date(),
  name: "Admin User"
}
```

### 6 Products (from specification)

1. **Email Newsletter Starter Pack**
   - Slug: `email-newsletter-starter-pack`
   - Price: $149
   - Type: ONE_TIME
   - Category: Marketing
   - Whop: TBD (add actual productId + checkoutUrl)

2. **Landing Page CRO Boost**
   - Slug: `landing-page-cro-boost`
   - Price: $597
   - Type: ONE_TIME
   - Category: Marketing

3. **Social Media Content Calendar**
   - Slug: `social-media-content-calendar`
   - Price: $199
   - Type: ONE_TIME
   - Category: Marketing

4. **Growth Accelerator Package**
   - Slug: `growth-accelerator-package`
   - Price: $599.67
   - Type: SUBSCRIPTION
   - Category: Marketing

5. **RealEstate AI Video Review**
   - Slug: `realestate-ai-video-review`
   - Price: $29.99
   - Type: SUBSCRIPTION
   - Category: Analytics

6. **Shopify Speed Surge**
   - Slug: `shopify-speed-surge`
   - Price: $500
   - Type: ONE_TIME
   - Category: Development

### Test Customer

```typescript
{
  email: "customer@example.com",
  password: "TestPassword123!", // hashed
  role: "CUSTOMER",
  emailVerified: new Date(),
  name: "Test Customer",
  productAccess: [
    { productId: product1.id, status: "ACTIVE", accessType: "LIFETIME" }
  ]
}
```

---

## API Routes Summary

### Public API

- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/contact` - Contact form submission
- `POST /api/newsletter` - Newsletter signup

### Protected API (Customer)

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `POST /api/user/avatar` - Upload avatar

### Protected API (Admin Only)

- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get single product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/content` - Create content item
- `PUT /api/admin/content/[id]` - Update content item
- `DELETE /api/admin/content/[id]` - Delete content item
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Update user
- `GET /api/admin/purchases` - List all purchases
- `POST /api/admin/access/grant` - Grant product access
- `POST /api/admin/access/revoke` - Revoke access
- `GET /api/admin/webhooks` - List webhook logs
- `POST /api/admin/webhooks/[id]/retry` - Retry failed webhook

### Webhook API

- `POST /api/webhooks/whop` - Whop webhook handler (signature verification)

### Auth API

- `POST /api/verify-email` - Send OTP
- `POST /api/verify-email/confirm` - Verify OTP
- `POST /api/auth/register` - Email/password signup
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset

---

## File Structure Overview

```
techsci-codecraft/
├── app/
│   ├── (auth)/                    # Auth pages (login, signup, verify, reset)
│   ├── (public)/                  # Public pages (products, about, legal)
│   ├── (dashboard)/dashboard/     # Customer portal (protected)
│   ├── (admin)/admin/             # Admin panel (admin only)
│   ├── api/                       # API routes
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Tailwind v4 config
│   ├── sitemap.ts                 # Sitemap generation
│   ├── robots.ts                  # Robots.txt
│   ├── not-found.tsx              # 404 page
│   └── error.tsx                  # Error boundary
│
├── components/
│   ├── ui/                        # Shadcn/UI components (15 installed, add more)
│   ├── auth/                      # Auth forms (6 components)
│   ├── layout/                    # Headers, footers, nav (6 components)
│   ├── dashboard/                 # Customer portal (10+ components)
│   ├── admin/                     # Admin panel (15+ components)
│   ├── products/                  # Product display (6 components)
│   ├── sections/                  # Homepage sections (6 components)
│   └── forms/                     # Contact, newsletter forms
│
├── lib/
│   ├── auth/
│   │   ├── config.ts              # NextAuth configuration
│   │   └── utils.ts               # Auth helpers
│   ├── db/
│   │   ├── prisma.ts              # Prisma client
│   │   └── seed.ts                # Database seeding
│   ├── email/
│   │   ├── send.ts                # Resend wrapper
│   │   └── templates/             # React Email templates (6 files)
│   ├── whop/
│   │   ├── webhook-handler.ts     # Process webhooks
│   │   └── verify-signature.ts    # Signature verification
│   ├── products.ts                # Product utilities
│   ├── constants.ts               # Site configuration
│   ├── validations.ts             # Zod schemas
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # General utilities (cn() exists)
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Migration files
│   └── seed.ts                    # Seed script
│
├── proxy.ts                       # Route protection (Next.js 16)
├── instrumentation-client.ts      # Sentry client init
├── sentry.server.config.ts        # Sentry server init
├── sentry.edge.config.ts          # Sentry edge init
├── .env.local                     # Environment variables (create)
├── .env.example                   # Env template (create)
└── README.md                      # Updated documentation

Total Estimate:
- ~60 new files to create
- ~15 existing files to modify
- ~50 components to build
- ~25 API routes to implement
```

---

## Success Criteria

### Technical

✅ All authentication flows work (Google OAuth, email/password, OTP)
✅ Database connected with Prisma (Hostinger PostgreSQL)
✅ All 6 products seeded with content
✅ Whop webhooks process correctly (signature verification, access grant)
✅ Customer portal shows purchased products
✅ Content delivery works (files, links, text, videos)
✅ Admin panel fully functional (CRUD operations)
✅ Email notifications send correctly (6 templates)
✅ Route protection via proxy.ts works
✅ Sentry captures errors
✅ Vercel Analytics tracks pageviews
✅ Rate limiting on critical routes
✅ No console errors
✅ TypeScript strict mode passing
✅ Lighthouse score 90+

### Design

✅ Consistent color palette across ALL pages
✅ Same component styling everywhere
✅ Unified navigation patterns
✅ Professional, trustworthy appearance
✅ Smooth animations (200ms transitions)
✅ Mobile responsive (all pages)
✅ Dark mode works perfectly

### Business

✅ Ready for Whop business verification
✅ Demonstrates complete fulfillment system
✅ Clear customer access flow
✅ Purchase tracking visible
✅ Content delivery system evident
✅ Screenshot-ready for verification submission

### User Experience

✅ Fast page loads (<2 seconds)
✅ Clear calls-to-action
✅ Helpful error messages
✅ Loading states everywhere
✅ Success feedback (toasts)
✅ Empty states with CTAs
✅ Accessible (keyboard nav, ARIA labels)

---

## Key Risks & Mitigations

### Risk 1: Database Connection Issues

**Mitigation**: Test Hostinger PostgreSQL connection early (Phase 1), use connection pooling, handle timeouts gracefully.

### Risk 2: NextAuth v5 Beta Instability

**Mitigation**: Follow official Next.js 15+ integration guide, use stable patterns, extensive testing of auth flows.

### Risk 3: Whop Webhook Failures

**Mitigation**: Comprehensive logging (WebhookLog table), retry mechanism, idempotency checks, manual access grant fallback.

### Risk 4: Design Inconsistency

**Mitigation**: Design system first (Phase 3), reusable components, CSS variables for colors, regular visual audits.

### Risk 5: Scope Creep

**Mitigation**: Strict adherence to plan, no new features during implementation, defer nice-to-haves to post-launch.

### Risk 6: Performance Issues

**Mitigation**: Database indexes on foreign keys, lazy loading, image optimization, bundle analysis, caching strategy.

---

## Environment Variables Checklist

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://codecraft.techsci.xyz
NEXT_PUBLIC_SITE_NAME=TechSci CodeCraft Agency

# Database (Hostinger PostgreSQL)
DATABASE_URL=postgresql://u646485450_codecraftagent:S5ICjW1CPHL@r**m@srv1833.hstgr.io:5432/u646485450_codecraftagent

# NextAuth.js
NEXTAUTH_URL=https://codecraft.techsci.xyz
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

# Resend API
RESEND_API_KEY=<from resend.com>
RESEND_FROM_EMAIL=noreply@techsci.xyz

# Whop Integration
WHOP_WEBHOOK_SECRET=<from Whop dashboard>
WHOP_API_KEY=apik_3VJMa9g5TlXnC_C4051472_C_74f9d412eadda122b0c7805d2703242ae6aaedb6817f53c68b3b7e694aba2a
WHOP_COMPANY_ID=biz_DVtB8NOUFdLlX0

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=<from Vercel dashboard>

# Sentry
SENTRY_DSN=https://442166e17691fd58f8782dfc84d4fb4e@o4507587199369216.ingest.us.sentry.io/4510817057570816

# Admin Configuration
ADMIN_EMAIL=admin@techsci.xyz
CONTACT_EMAIL=support@techsci.xyz

# Optional: Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=<if using Upstash>
UPSTASH_REDIS_REST_TOKEN=<if using Upstash>
```

---

## Testing Checklist

### Phase 2 Testing (Auth)

- [ ] Google OAuth login creates user account
- [ ] Google OAuth links to existing email
- [ ] Email/password signup sends OTP
- [ ] OTP verification marks email as verified
- [ ] Login requires verified email
- [ ] Forgot password sends reset email
- [ ] Password reset works with valid token
- [ ] Password reset fails with expired token
- [ ] Sessions persist across refreshes
- [ ] Logout clears session

### Phase 4 Testing (Webhooks)

- [ ] payment.succeeded creates user and grants access
- [ ] payment.succeeded sends access email
- [ ] membership.went_valid activates subscription
- [ ] membership.went_invalid expires subscription
- [ ] payment.refunded revokes access
- [ ] Webhook signature verification works
- [ ] Invalid signatures are rejected
- [ ] Duplicate webhooks are idempotent
- [ ] Webhook logs capture all events

### Phase 5 Testing (Customer Portal)

- [ ] Dashboard shows purchased products
- [ ] Product access page requires active access
- [ ] Files download correctly (Vercel Blob)
- [ ] External links open correctly
- [ ] Text content renders (markdown)
- [ ] Videos embed correctly
- [ ] Expired subscriptions show warning
- [ ] No access redirects to product page
- [ ] Profile updates save correctly
- [ ] Password change requires current password
- [ ] Avatar upload works (Vercel Blob)

### Phase 6 Testing (Admin Panel)

- [ ] Admin role required for /admin routes
- [ ] Product CRUD operations work
- [ ] Content item CRUD works
- [ ] File uploads work (Vercel Blob)
- [ ] User management works (role changes)
- [ ] Manual access grant works
- [ ] Manual access revoke works
- [ ] Purchase list shows all purchases
- [ ] Webhook logs show all events
- [ ] Webhook retry works

### Phase 7 Testing (Production)

- [ ] All tests pass in production environment
- [ ] Google OAuth works with production URLs
- [ ] Whop webhooks deliver to production endpoint
- [ ] Emails send from production
- [ ] File uploads work in production
- [ ] Database migrations applied
- [ ] Seed data created
- [ ] SSL certificate valid
- [ ] Performance targets met (Lighthouse 90+)
- [ ] No console errors
- [ ] Sentry receiving errors
- [ ] Analytics tracking pageviews

---

## Phase 8: Google reCAPTCHA Enterprise ✅ (2026-02-04)

Invisible reCAPTCHA Enterprise added to all public-facing forms.

**Config:**
- Site Key: `6Len9GAsAAAAAEOmgoKiID2C5xQRVfHyLmMuUCUM`
- Project: `shining-courage-465501-i8`
- Score threshold: 0.5
- API Key env: `RECAPTCHA_API_KEY`
- Site Key env: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

**New files:**
- `lib/recaptcha.ts` — server-side assessment call + score check. Fails open in dev if env vars missing.
- `hooks/use-recaptcha.ts` — client hook wrapping `grecaptcha.enterprise.execute()`

**Script load:**
- `app/layout.tsx` `<head>` — Enterprise script loaded globally (invisible, no widget rendered)

**Protected forms + actions:**

| Action | Client | API route |
|---|---|---|
| `SIGNUP` | `app/(auth)/signup/page.tsx` | `api/auth/register` |
| `FORGOT_PASSWORD` | `app/(auth)/forgot-password/page.tsx` | `api/auth/forgot-password` |
| `CONTACT` | `components/forms/contact-form.tsx` | `api/contact` |
| `NEWSLETTER` | `components/forms/newsletter-form.tsx` | `api/newsletter` |

Each form calls `executeRecaptcha(action)` before fetch, passes `recaptchaToken` in body.
Each API route extracts `recaptchaToken` from the Zod-parsed body, calls `verifyRecaptcha(token, action)`, returns 403 if it fails.

---

## Phase 9: Discord + Content Delivery + News Feed ✅ (2026-02-04)

### Objectives
1. Wire Discord invite link into products + emails + dashboard
2. Seed real ContentItems for all 6 products (TEXT guides, LINK tools, VIDEO tutorials)
3. Add a "News & Updates" feed on the customer dashboard (global announcements for owned products)

### Rules for this phase
- **NEVER** run `bun run dev` or `bun run build` — they are expensive
- Before any build attempt, run `bun run lint` first. Fix all lint + type errors in-place.
- **NO `any`, `undefined`, `null` types.** Every variable must have a proper mapped type.
- Maintain full design consistency: glass-morphic cards (`bg-card/50 backdrop-blur-xl border border-border/50`), `bg-linear-to-*` gradients, 200ms transitions, same spacing scale.
- All new components follow existing patterns (Suspense + Skeleton, server data fetch → client render split).

### 9.1 Schema Changes (`prisma/schema.prisma`)
Add to `Product` model:
```prisma
discordInviteUrl  String?   // Discord community invite link
```

Add new `NewsItem` model:
```prisma
model NewsItem {
  id          String   @id @default(cuid())
  title       String
  body        String   @db.Text
  productId   String?  // null = global, set = product-specific
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  product Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@index([productId])
  @@index([published])
  @@index([createdAt])
}
```

Add relation back to Product:
```prisma
newsItems NewsItem[]
```

Run: `bunx prisma db push`

### 9.2 Seed ContentItems + Discord URL (`lib/db/seed.ts`)
For each of the 6 products, add 3-5 ContentItems covering:
- **TEXT**: Step-by-step guide (markdown)
- **LINK**: Relevant external tool link
- **VIDEO**: YouTube tutorial URL
- **FILE**: Placeholder entry (fileUrl can point to a sample Blob path)

Set `discordInviteUrl: "https://discord.gg/unz5hBd5"` on ALL 6 products.

Seed 2 sample NewsItems:
- One global (productId = null, published = true): "Welcome to CodeCraft"
- One product-specific (productId = email-newsletter product, published = true): "New templates added"

### 9.3 Admin: Discord URL field (`components/admin/product-form.tsx`)
- Add `discordInviteUrl` to the Zod schema (optional, url or empty string)
- Add an Input field in a new "Community" card section (same glass-morphic pattern)
- Placeholder: "https://discord.gg/xxxxx"

### 9.4 Admin API: Accept discordInviteUrl (`app/api/admin/products/[id]/route.ts`)
- Add `discordInviteUrl` to `updateProductSchema`
- Pass it through to `prisma.product.update`

### 9.5 Admin: News management
- New page: `app/(admin)/admin/news/page.tsx` — list all NewsItems, create/edit/delete
- New API: `app/api/admin/news/route.ts` (GET list, POST create)
- New API: `app/api/admin/news/[id]/route.ts` (PUT update, DELETE remove)
- Add "News" to admin sidebar nav

### 9.6 Dashboard: Discord card (`app/(dashboard)/dashboard/products/[slug]/page.tsx`)
- After the content viewer, if `product.discordInviteUrl` is set, render a Discord card:
  - Purple-tinted glass card with Discord icon
  - "Join our community" heading
  - "Open Discord" button linking to the invite URL (target=_blank)

### 9.7 Dashboard: News & Updates feed (`app/(dashboard)/dashboard/page.tsx`)
- New section at bottom: "News & Updates"
- Query: all published NewsItems where productId IS NULL OR productId IN (user's owned product IDs)
- Render as a card list sorted by createdAt desc, max 5 items
- Each card: title, body preview (truncated), createdAt relative time, product tag if product-specific
- New component: `components/dashboard/news-feed.tsx`

### 9.8 Email: Discord link in purchase-confirmation
- Add optional `discordInviteUrl?: string` prop to `PurchaseConfirmationEmailTemplate`
- When set, add a section: "Join our Discord community" with a button linking to the invite
- The webhook handler already has the product object — pass `product.discordInviteUrl` through

### 9.9 Webhook handler update (`lib/whop/webhook-handler.ts`)
- In `payment.succeeded`, after fetching the product, pass `discordInviteUrl` to the email send call

### Files touched
- `prisma/schema.prisma` — add discordInviteUrl to Product, add NewsItem model
- `lib/db/seed.ts` — ContentItems + discordInviteUrl + NewsItems
- `components/admin/product-form.tsx` — Discord URL input
- `app/api/admin/products/[id]/route.ts` — schema + update
- `app/(admin)/admin/news/page.tsx` — NEW
- `app/api/admin/news/route.ts` — NEW
- `app/api/admin/news/[id]/route.ts` — NEW
- `components/admin/news-form.tsx` — NEW
- `components/admin/news-table.tsx` — NEW
- `app/(dashboard)/dashboard/products/[slug]/page.tsx` — Discord card
- `app/(dashboard)/dashboard/page.tsx` — News feed section
- `components/dashboard/news-feed.tsx` — NEW
- `lib/email/templates/purchase-confirmation.tsx` — Discord link
- `lib/whop/webhook-handler.ts` — pass discordInviteUrl to email
- Admin sidebar nav (layout or nav component) — add News link

### Testing checklist
- [ ] `bunx prisma db push` succeeds
- [ ] `bun run seed` creates ContentItems + NewsItems + sets discordInviteUrl
- [ ] Admin product edit shows Discord URL field, saves correctly
- [ ] Admin news CRUD works (create, list, edit, delete)
- [ ] Dashboard product page shows Discord card when URL is set
- [ ] Dashboard home shows News & Updates feed
- [ ] Purchase confirmation email includes Discord link
- [ ] `bun run lint` passes with zero errors

---

## Verification Plan for Whop

### Documentation to Prepare

1. **System Architecture Diagram**
   - Show complete flow: Purchase → Webhook → Access Grant

2. **Screenshots**
   - Product listing page
   - Product detail page with Whop checkout button
   - Customer dashboard showing purchased products
   - Product access page with content
   - Admin panel (product management, access management)
   - Webhook logs showing successful processing

3. **Access Flow Documentation**
   - Step-by-step customer journey
   - Webhook processing explanation
   - Email notification examples

4. **Test Account**
   - Provide test customer account credentials
   - Show purchased product with active access
   - Demonstrate content delivery

### Verification Submission

- Submit platform URL: https://codecraft.techsci.xyz
- Provide screenshots and documentation
- Offer test account access
- Demonstrate complete fulfillment system
- Show webhook integration is live

---

## Implementation Timeline

**Estimated Duration**: 7-8 days (full-time)

- **Day 1-2**: Phase 1 (Foundation & Database) + Phase 2 (Auth)
- **Day 3-4**: Phase 3 (Public Website) + Phase 4 (Whop Integration)
- **Day 5-6**: Phase 5 (Customer Portal) + Phase 6 (Admin Panel)
- **Day 7-8**: Phase 7 (Polish & Production) + Testing + Deployment

**Total Estimate**:

- ~60 files to create
- ~2000+ lines of code (backend)
- ~3000+ lines of code (frontend)
- ~6 email templates
- ~25 API routes
- ~50 React components

---

## Final Notes

### Critical Success Factors

1. **Production-ready code from start** - No TODOs, no placeholders
2. **Consistent design system** - Same colors, spacing, components everywhere
3. **Comprehensive error handling** - Graceful failures, helpful messages
4. **Security by default** - Rate limiting, validation, sanitization
5. **Mobile-first approach** - Responsive on all devices
6. **Performance optimization** - Fast loads, lazy loading, code splitting
7. **Thorough testing** - Automated + manual, all critical paths

### Reference Documentation

- Next.js 16 docs (App Router, proxy.ts)
- NextAuth.js v5 docs (beta)
- Prisma docs (PostgreSQL, migrations)
- Shadcn/UI docs (component installation)
- Tailwind CSS v4 docs (CSS-first config)
- Resend docs (email sending)
- React Email docs (templates)
- Vercel Blob docs (file storage)
- Sentry docs (Next.js integration)
- CLAUDE.md (project specification)
- .cursor/rules/rules.md (Sentry patterns)

### Quality Standards

- TypeScript strict mode
- ESLint passing
- No console warnings/errors
- Lighthouse 90+ score
- WCAG 2.1 AA accessibility
- Mobile-friendly (responsive)
- Fast performance (<2s loads)
- Production-ready code

---

**This plan is comprehensive, production-focused, and aligned with all user requirements. Ready to execute!** 🚀
