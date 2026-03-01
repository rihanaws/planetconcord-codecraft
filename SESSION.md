# SESSION HANDOFF — CodeCraft Agency
**Last updated: March 2, 2026 | Branch: main | Commit: f8930e2**

Use this file to start a new Claude session with full context.

---

## Project in One Line

Production digital product marketplace at **codecraft.techsci.xyz** — Next.js 16 + Prisma + PostgreSQL (Neon) + Whop payments + PayPal + full admin panel.

---

## Current State — Everything Working

- ✅ 10 products live and selling
- ✅ Whop + PayPal webhooks processing payments
- ✅ Customer dashboard with content delivery
- ✅ Admin panel: products, users, access, purchases, settings, dispute evidence
- ✅ 4 cron jobs running on Vercel Pro
- ✅ Lint: 0 errors | Build: clean | TypeScript: 0 errors

---

## What Was Done This Session (2026-03-02)

### 1. Admin Dispute Evidence Page
- New page: `/admin/disputes/[purchaseId]`
- Sections: customer info, transaction, product access, deliverables, Whop access log, timeline, rebuttal, refund policy analysis
- `DisputePrintButton` → `window.print()` → PDF
- Purchase table "Evidence" button now links to this page (was raw JSON)
- Print CSS added to `globals.css`

### 2. Legal Pages Rewritten
- `/refund` — milestone-based policy (not "30-day guarantee"), phase table, chargeback warning
- `/terms` — 16 sections matching whop-terms.md, chargebacks §7, user responsibilities §4

### 3. Dispute Evidence Documents (local only, not committed)
- `dispute-evidence/` folder — HTML/MD files for George's chargeback
- Evidence deadline: **April 6, 2026**

---

## Active Dispute: George (ar3636998@yahoo.com)

| Field | Value |
|-------|-------|
| Product | Landing Page CRO Boost |
| Amount | $507.27 |
| Whop Payment ID | pay_4XEFaQjGrdrwqH |
| Purchase | Feb 2, 2026 |
| Email Verified | Feb 14, 2026 |
| Delivered | Feb 15, 2026 |
| Dispute Filed | Feb 26, 2026 |
| Dispute Reason | "No cardholder authorisation" |
| Evidence Deadline | **April 6, 2026** |
| Admin Evidence Page | `/admin/disputes/cmlmt02uy0000k8s1woqmn09h` |

**Key argument:** Whop log confirms ToS agreed at checkout + email verified 12 days post-purchase + product delivered 11 days before dispute = friendly fraud.

---

## Key File Locations

| What | Where |
|------|-------|
| DB schema | `prisma/schema.prisma` |
| Auth config | `lib/auth/config.ts` |
| Whop webhook handler | `lib/whop/webhook-handler.ts` |
| PayPal webhook handler | `lib/paypal/webhook-handler.ts` |
| Activity logger | `lib/activity-logger.ts` |
| Settings cache | `lib/settings.ts` |
| Rate limiting | `lib/rate-limit.ts` |
| Admin dispute page | `app/(admin)/admin/disputes/[purchaseId]/page.tsx` |
| Dispute evidence API | `app/api/admin/disputes/[purchaseId]/evidence/route.ts` |
| Terms page | `app/(public)/terms/page.tsx` |
| Refund page | `app/(public)/refund/page.tsx` |
| Purchase table | `components/admin/purchase-table.tsx` |
| Constants | `lib/constants.ts` |

---

## Critical Rules (never forget)

- **Next.js 16:** `proxy.ts` not `middleware.ts`; `params` is a Promise — always `await params`
- **Tailwind v4:** NO config file; use `bg-linear-to-*` not `bg-gradient-to-*`
- **Prisma 7:** Neon adapter; React `cache()` on read-heavy queries
- **NextAuth v5:** `auth()` not `getServerSession`; `updateMany` in signIn callback
- **Zod v4:** `error.issues` not `error.errors`; `.email()` is fine
- **Sentry v10:** `tracesSampleRate` only — no `replays`, no `ConsoleIntegration`
- **Client components:** never import Prisma; use enum values not strings
- **Prisma JSON fields:** cast with `as Prisma.InputJsonValue`
- **Scripts:** `set -a && source .env.local && set +a && npx tsx scripts/<name>.ts`

---

## Webhooks

| Platform | URL | Auth |
|----------|-----|------|
| Whop | `/api/webhooks/whop` | HMAC-SHA256 |
| PayPal | `/api/webhooks/paypal` | PayPal API verification |

Whop webhook secret: read from DB (`AppSetting`) → falls back to `WHOP_WEBHOOK_SECRET` env var.

---

## Cron Jobs (Vercel Pro)

| Job | Schedule | Route |
|-----|----------|-------|
| cleanup-subscriptions | `0 */6 * * *` | `/api/cron/cleanup-subscriptions` |
| cleanup-video-analyses | `*/5 * * * *` | `/api/cron/cleanup-video-analyses` |
| retry-webhooks | `*/15 * * * *` | `/api/cron/retry-webhooks` |
| post-purchase-checkin | `0 10 * * *` | `/api/cron/post-purchase-checkin` |

Auth: `Authorization: Bearer $CRON_SECRET` (auto-injected by Vercel).

---

## Deploy

```bash
git push origin main   # Vercel auto-deploys
```

---

## Next Possible Tasks

- Submit dispute evidence to Whop before April 6, 2026
- Screenshot admin dispute page for Whop evidence upload
- Further product/content additions
- Customer-facing improvements
