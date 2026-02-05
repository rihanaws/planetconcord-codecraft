# Development Sessions - TechSci CodeCraft Agency

---

## 📅 Sessions 1-7 — Phases 1-7
**Dates:** 2026-02-02 to 2026-02-03
**Status:** ✅ ALL COMPLETE

All 7 core phases delivered and deployed:
1. Foundation & Database
2. Authentication System
3. Public Website
4. Whop Integration
5. Customer Portal
6. Admin Panel
7. Polish & Production

See commit history for full details. Latest Phase 7 commit: `a773f12`

---

## 📅 Session 8 — Production Fixes + reCAPTCHA Enterprise
**Date:** 2026-02-04
**Status:** ✅ COMPLETED
**Branch:** main

### What Was Done

#### 1. Vercel Env Vars — Full Audit & Fix ✅
**Problem:** Most vars were set to Development only. Several bad vars existed.

**Removed from Vercel:**
- `GOOGLE_REDIRECT_URI` — was `localhost:3000`, broke production OAuth. NextAuth handles this automatically with `trustHost: true`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — redundant, code uses server-side `GOOGLE_CLIENT_ID`

**Added to Production + Preview (were Development-only):**
SENTRY_DSN, WHOP_API_KEY, WHOP_COMPANY_ID, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_SITE_NAME, NEXT_PUBLIC_APP_URL, ADMIN_EMAIL, CONTACT_EMAIL, RESEND_FROM_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

**Added to all 3 envs (was completely missing):**
WHOP_WEBHOOK_SECRET → set to real secret `ws_3dbd555ca0af0f0841b3c0dd2c928b6e3a9261f4be3320595568e878a17b56f5`

#### 2. Google OAuth Keys — Rotated ✅
Old client ID/secret replaced with new ones across `.env.local`, `.env`, and all Vercel environments.

**New Client ID:** `829539499949-tvo2ter1le8b5trj9b03d74fv9i83014.apps.googleusercontent.com`

**Google Cloud Console configured with:**
- Authorized JavaScript Origins: `https://codecraft.techsci.xyz`, `https://techsci-codecraft.vercel.app`
- Authorized Redirect URIs: `https://codecraft.techsci.xyz/api/auth/callback/google`, `https://techsci-codecraft.vercel.app/api/auth/callback/google`

#### 3. Google OAuth — AccessDenied Bug Fix ✅
**Problem:** `login?error=AccessDenied` after Google redirected back successfully.

**Root cause:** `lib/auth/config.ts` `signIn` callback was calling `prisma.user.update({ where: { id: user.id } })`. With NextAuth v5 database sessions, the Prisma adapter creates the user row AFTER `signIn` fires. The update threw (user not found), NextAuth caught the unhandled error silently, returned AccessDenied.

**Fix:** Changed to `prisma.user.updateMany({ where: { email: user.email } })` — no-op if row doesn't exist yet (0 rows matched, no throw). Sets `emailVerified` correctly once the adapter creates the row.

**File:** `lib/auth/config.ts` lines 107-114

#### 4. Google reCAPTCHA Enterprise — Full Implementation ✅
Invisible reCAPTCHA Enterprise on all public-facing forms. No CAPTCHA box shown to users — scores silently.

**New files:**
- `lib/recaptcha.ts` — server utility. POSTs to Google assessment API, checks score >= 0.5. Fails open in dev if env vars missing.
- `hooks/use-recaptcha.ts` — client hook. Wraps `grecaptcha.enterprise.execute()`.

**Modified — script load:**
- `app/layout.tsx` — Enterprise script in `<head>` (invisible)

**Modified — 4 client forms:**

| File | Action |
|------|--------|
| `app/(auth)/signup/page.tsx` | SIGNUP |
| `app/(auth)/forgot-password/page.tsx` | FORGOT_PASSWORD |
| `components/forms/contact-form.tsx` | CONTACT |
| `components/forms/newsletter-form.tsx` | NEWSLETTER |

**Modified — 4 API routes (server verify before processing):**

| Route | Action |
|-------|--------|
| `app/api/auth/register/route.ts` | SIGNUP |
| `app/api/auth/forgot-password/route.ts` | FORGOT_PASSWORD |
| `app/api/contact/route.ts` | CONTACT |
| `app/api/newsletter/route.ts` | NEWSLETTER |

**New env vars (all 3 Vercel envs + local):**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lf0rmAsAAAAAOugl9XHvb7ztBq7kEUAwDbcYTCk`
- `RECAPTCHA_API_KEY=AIzaSyDjV2iRqGXo6iLbcHEP5fAEnGmdXgBQuuc`

**reCAPTCHA config:**
- Site Key: `6Lf0rmAsAAAAAOugl9XHvb7ztBq7kEUAwDbcYTCk`
- Project ID: `shining-courage-465501-i8`
- Assessment endpoint: `https://recaptchaenterprise.googleapis.com/v1/projects/shining-courage-465501-i8/assessments?key=<API_KEY>`
- Score threshold: 0.5

#### 5. Deployments ✅
Multiple production deploys during the session. All changes live at `https://codecraft.techsci.xyz`.

### Bugs Fixed This Session
1. **Vercel env vars missing from Production/Preview** — most vars were Development-only
2. **WHOP_WEBHOOK_SECRET placeholder** — was `your_whop_webhook_secret_here`, set to real secret
3. **Google OAuth redirect_uri_mismatch** — Google Cloud had path as `/api/auth/google/callback` instead of correct `/api/auth/callback/google`
4. **Google OAuth AccessDenied** — `prisma.user.update` crash in `signIn` callback, fixed with `updateMany`

### Lessons Learned (added to CLAUDE.md)
- NextAuth v5 callback path: `/api/auth/callback/google` NOT `/api/auth/google/callback`
- Never use `prisma.user.update` in NextAuth `signIn` callback with db sessions — user may not exist yet
- Never set `GOOGLE_REDIRECT_URI` — NextAuth + `trustHost: true` auto-generates it
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is redundant — only `GOOGLE_CLIENT_ID` (server) is needed
- Vercel `env add` reads value from stdin: `echo -n "value" | npx vercel env add NAME env --force`

---

## 📊 Progress Tracker

| Phase | Status | Completion Date |
|-------|--------|-----------------|
| Phase 1: Foundation & Database | ✅ Complete | 2026-02-02 |
| Phase 2: Authentication System | ✅ Complete | 2026-02-02 |
| Phase 3: Public Website | ✅ Complete | 2026-02-03 |
| Phase 4: Whop Integration | ✅ Complete | 2026-02-03 |
| Phase 5: Customer Portal | ✅ Complete | 2026-02-03 |
| Phase 6: Admin Panel | ✅ Complete | 2026-02-03 |
| Phase 7: Polish & Production | ✅ Complete | 2026-02-03 |
| Phase 8: reCAPTCHA + Prod Fixes | ✅ Complete | 2026-02-04 |

**Overall Progress:** 100% (8/8 phases complete)

---

## 🔗 Quick Links

- **Repository:** https://github.com/code-craka/codecraft-agent.git
- **Domain:** https://codecraft.techsci.xyz
- **Google Cloud Console:** https://console.cloud.google.com/
- **Resend Dashboard:** https://resend.com/
- **Whop Dashboard:** https://whop.com/
- **Sentry Dashboard:** https://sentry.io/
- **Vercel Dashboard:** https://vercel.com/techsci/techsci-codecraft

---

**Last Updated:** 2026-02-04
**Current Branch:** main
**Latest deployed commit:** f7dd87b (+ uncommitted reCAPTCHA + auth fix changes)
