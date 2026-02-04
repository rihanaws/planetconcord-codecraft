# 🚀 TechSci CodeCraft Agency

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-f472b6?style=for-the-badge&logo=bun)](https://bun.sh/)

A production-ready digital product marketplace that integrates with Whop for payments, automatically provisions customer access, and provides secure portals for both customers and admins.

🌐 **Live Demo:** [codecraft.techsci.xyz](https://codecraft.techsci.xyz)

---

## 🎯 Implementation Status — All Phases Complete ✅

**Phase 1: Foundation & Database Setup** ✅
- Complete database schema with 9 models (User, Account, Session, VerificationToken, Product, ProductAccess, Purchase, ContentItem, WebhookLog)
- MySQL connection via Prisma 7 + MariaDB adapter
- Database seeded with admin, test customer, and 6 products

**Phase 2: Authentication System** ✅
- NextAuth.js v5 with database sessions
- Google OAuth 2.0 (auto email verification)
- Email/Password with 6-digit OTP (10-min expiry)
- Route protection via proxy.ts (Next.js 16)
- 5 auth pages, 6 React Email templates

**Phase 3: Public Website** ✅
- Homepage with hero, features, testimonials, FAQ, CTA
- Product listing with search/filter/sort
- Product detail pages with Whop checkout integration
- Legal pages: About, Contact, Terms, Privacy, Refund
- SEO: sitemap.xml, robots.txt, OG tags, structured data

**Phase 4: Whop Integration** ✅
- Webhook handler with HMAC-SHA256 signature verification
- 4 event handlers: payment.succeeded, membership.went_valid, membership.went_invalid, payment.refunded
- Auto user creation, access provisioning, email notifications
- Idempotency checks, transaction safety, Sentry tracking
- Webhook replay and test endpoints

**Phase 5: Customer Portal** ✅
- Dashboard with stats cards, product access grid, purchase history
- Content viewer: Files (download), Links, Text (expandable), Videos (YouTube/Vimeo)
- Purchase history with search/filter/CSV export
- Profile management: avatar upload, name/email, password change

**Phase 6: Admin Panel** ✅
- Analytics dashboard with revenue chart and activity feeds
- Full product CRUD with content item management (FILE/LINK/TEXT/VIDEO)
- User management with role control and detail modal
- Access management: grant (lifetime/subscription) and revoke
- Purchase table with filters and CSV export
- Webhook logs with payload viewer and retry

**Phase 7: Production Polish** ✅
- Security headers (HSTS, X-Frame-Options, CSP, Permissions-Policy)
- Custom 404 page and error boundaries (root + all route groups)
- Vitest unit tests: auth utils, signature verification, validation schemas, webhook handlers
- Playwright E2E tests: auth flows, public pages, 404, route protection, mobile responsiveness
- Performance: compressed responses, image optimization (Vercel Blob + Google avatars), X-Powered-By disabled

---

## 📋 Table of Contents

- [Implementation Status](#-implementation-status)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database](#-database)
- [Products](#-products)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 🔐 **Authentication System**
- Google OAuth 2.0 integration
- Email/Password with OTP verification
- Secure session management with NextAuth.js v5
- Role-based access control (Customer/Admin)

### 💳 **Payment & Fulfillment**
- Whop payment integration
- Automated webhook processing
- Instant access provisioning
- Subscription management

### 👥 **Customer Portal**
- Personalized dashboard
- Product access management
- Content delivery (files, links, text, videos)
- Purchase history tracking
- Profile management with avatar upload

### 🛠️ **Admin Panel**
- Comprehensive product management
- User access control
- Manual access grant/revoke
- Webhook logs and debugging
- Analytics dashboard
- Content management system

### 📧 **Email System**
- Transactional emails via Resend
- OTP verification codes
- Purchase confirmations
- Access notifications
- Password reset flows

### 🎨 **Design & UX**
- Consistent design system across all pages
- Professional SaaS-style interface
- Mobile-responsive layout
- Dark mode support
- Smooth animations with Framer Motion
- Accessible (WCAG 2.1 AA compliant)

---

## 🛠️ Tech Stack

### **Core Framework**
- **Next.js 16.1.6** - App Router with React Server Components
- **React 19.2.3** - UI library
- **TypeScript 5.x** - Type safety
- **Bun** - Fast package manager and runtime

### **Styling & UI**
- **Tailwind CSS v4** - CSS-first configuration
- **shadcn/ui** - High-quality component library (new-york style)
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **next-themes** - Dark mode support

### **Database & ORM**
- **MySQL** - Database (hosted on Hostinger)
- **Prisma ORM 7.3.0** - Type-safe database access
- **@prisma/adapter-mariadb** - MySQL connection adapter

### **Authentication**
- **NextAuth.js v5** - Authentication solution
- **Google OAuth 2.0** - Social login
- **bcryptjs** - Password hashing

### **Integrations**
- **Whop** - Payment processing and webhooks
- **Resend** - Transactional email service
- **Vercel Blob** - File storage
- **Sentry** - Error tracking and monitoring

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting (via prettier plugin)
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
techsci-codecraft/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages (login, signup, verify)
│   ├── (public)/                 # Public pages (products, about, legal)
│   ├── (dashboard)/dashboard/    # Customer portal (protected)
│   ├── (admin)/admin/            # Admin panel (admin only)
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth.js routes
│   │   ├── webhooks/             # Whop webhook handler
│   │   └── ...                   # Other API endpoints
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Tailwind v4 config + theme variables
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Authentication forms
│   ├── layout/                   # Headers, footers, navigation
│   ├── dashboard/                # Customer portal components
│   ├── admin/                    # Admin panel components
│   ├── products/                 # Product display components
│   └── sections/                 # Homepage sections
│
├── lib/
│   ├── auth/                     # NextAuth.js configuration
│   ├── db/                       # Prisma client & seed script
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── seed.ts               # Database seeding
│   ├── email/                    # Email service & templates
│   ├── whop/                     # Webhook handlers
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # Database schema (8 models)
│   └── migrations/               # Database migrations
│
├── public/                       # Static assets
├── proxy.ts                      # Route protection (Next.js 16)
├── prisma.config.ts              # Prisma 7 configuration
├── .env.example                  # Environment variables template
└── CLAUDE.md                     # AI coding assistant instructions

Total: 60+ files, 2000+ lines of backend code, 3000+ lines of frontend code
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (v1.0+) - [Install Bun](https://bun.sh/)
- **MySQL Database** - Hostinger or any MySQL-compatible database
- **Google OAuth Credentials** - [Google Cloud Console](https://console.cloud.google.com/)
- **Resend Account** - [resend.com](https://resend.com/)
- **Whop Account** - [whop.com](https://whop.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/code-craka/codecraft-agent.git
   cd codecraft-agent
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   - `DATABASE_URL` - MySQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `RESEND_API_KEY` - From Resend dashboard
   - `WHOP_*` - From Whop dashboard
   - `SENTRY_DSN` - From Sentry project

4. **Generate Prisma Client**
   ```bash
   bunx prisma generate
   ```

5. **Push database schema**
   ```bash
   bunx prisma db push
   ```

6. **Seed the database**
   ```bash
   bun lib/db/seed.ts
   ```

7. **Run the development server**
   ```bash
   bun dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

### Available Scripts

```bash
# Development server
bun dev                           # Start dev server at localhost:3000

# Build & Production
bun run build                     # Create production build
bun start                         # Start production server
bun run analyze                   # Production build with bundle analyzer

# Code Quality
bun run lint                      # Run ESLint

# Testing
bun run test                      # Run unit tests (vitest)
bun run test:watch                # Run unit tests in watch mode
bun run test:e2e                  # Run E2E tests (playwright, installs browsers first)
bun run test:e2e:ui               # Run E2E tests with Playwright UI

# Database Operations
bunx prisma generate              # Generate Prisma Client
bunx prisma db push               # Push schema to database
bun lib/db/seed.ts                # Seed database with initial data
bunx prisma studio                # Open Prisma Studio GUI
bunx prisma migrate dev           # Create new migration (requires shadow DB)
bunx prisma migrate deploy        # Deploy migrations to production
bunx prisma migrate reset         # Reset database (deletes all data)
```

### Development Workflow

1. Make your changes
2. Test locally with `bun dev`
3. Run linting with `bun run lint`
4. Commit your changes
5. Push to GitHub
6. Deploy via Vercel

---

## 🗄️ Database

### Schema Overview

The database consists of **8 main models**:

- **User** - Customers and admins with authentication
- **Account** - OAuth provider accounts
- **Session** - User sessions (NextAuth.js)
- **VerificationToken** - OTP codes and password reset tokens
- **Product** - 6 digital products with pricing and details
- **ProductAccess** - Junction table for user-product access
- **Purchase** - Payment records from Whop
- **ContentItem** - Digital deliverables (files, links, text, videos)
- **WebhookLog** - Whop webhook event logs for debugging

### Test Accounts

Seed passwords are read from environment variables. Set them before running the seed script:

```bash
SEED_ADMIN_PASSWORD=<your_value> SEED_CUSTOMER_PASSWORD=<your_value> bun lib/db/seed.ts
```

| Role | Email |
|------|-------|
| Admin | admin@techsci.xyz |
| Customer | customer@example.com (has access to Email Newsletter Starter Pack) |

### Database Management

```bash
# View and edit data visually
bunx prisma studio

# Reset database (WARNING: Deletes all data)
bunx prisma migrate reset

# Re-seed after reset
bun lib/db/seed.ts
```

---

## 📦 Products

Currently selling **6 premium digital products**:

| Product | Price | Type | Category |
|---------|-------|------|----------|
| Email Newsletter Starter Pack | $149 | One-time | Marketing |
| Landing Page CRO Boost | $597 | One-time | Marketing |
| Social Media Content Calendar | $199 | One-time | Marketing |
| Growth Accelerator Package | $599.67/mo | Subscription | Marketing |
| RealEstate AI Video Review | $29.99/mo | Subscription | Analytics |
| Shopify Speed Surge | $500 | One-time | Development |

All products are fully configured with:
- Complete descriptions and features
- Deliverables and requirements
- FAQ sections
- Whop integration ready

---

## 🏗️ Architecture

### Key Application Flow

```
Customer Journey:
Public Site → Browse Products → Whop Checkout → Payment Success →
Whop Webhook → Auto-Create User Account → Grant Product Access →
Email Notification → Customer Login → Dashboard → Access Content

Admin Journey:
Admin Login → Admin Panel → Manage Products/Users/Access →
Monitor Webhooks → View Analytics
```

### Authentication Flow

- **Google OAuth**: Auto-create accounts via NextAuth.js
- **Email/Password**: Requires 6-digit OTP verification (10-min expiry)
- **Route Protection**: Handled by `proxy.ts` (Next.js 16)

### Webhook Processing

1. Whop sends webhook to `/api/webhooks/whop`
2. Verify webhook signature (HMAC-SHA256)
3. Validate payload with Zod schema
4. Route to appropriate handler
5. Process event (create user, grant access, etc.)
6. Send email notification
7. Log event to database

---

## 🚀 Deployment

### Vercel Deployment

1. **Connect repository to Vercel**
   - Import project from GitHub
   - Select framework preset: Next.js

2. **Configure environment variables**
   - Add all variables from `.env.local`
   - Ensure production URLs are correct

3. **Setup integrations**
   - Vercel Blob Storage for file uploads
   - Vercel Analytics for monitoring

4. **Deploy**
   - Push to `main` branch for automatic deployment
   - Or deploy manually from Vercel dashboard

### Post-Deployment

1. **Google OAuth**
   - Add production URL to authorized origins
   - Add callback URL: `https://your-domain.com/api/auth/callback/google`

2. **Whop Webhook**
   - Configure endpoint: `https://your-domain.com/api/webhooks/whop`
   - Select events: payment.succeeded, membership.*, payment.refunded

3. **Database**
   - Run `bunx prisma db push` (or migrations if using shadow DB)
   - Run seed script to populate initial data

4. **DNS**
   - Point domain to Vercel
   - Wait for SSL certificate

---

## 🔒 Security

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Webhook signature verification (HMAC-SHA256)
- ✅ Rate limiting on critical routes
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Prisma parameterization)
- ✅ XSS prevention (React auto-escape)
- ✅ CSRF protection (built-in Next.js)
- ✅ Secure session management
- ✅ Role-based access control
- ✅ Environment variable validation

---

## 🤝 Contributing

This is a production project for TechSci, Inc. If you're part of the team:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

Copyright © 2026 TechSci, Inc. (Delaware Corporation)

This project is proprietary and confidential.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Resend](https://resend.com/) - Email infrastructure
- [Whop](https://whop.com/) - Payment processing
- [Vercel](https://vercel.com/) - Deployment platform

---

**Made with ❤️ by TechSci CodeCraft Agency**

For support, contact: [support@techsci.xyz](mailto:support@techsci.xyz)
