# Phase 2 Corrections - Align with Main Plan

This document tracks corrections needed to align Phase 2 implementation with the main plan (`.claude/plans/dapper-nibbling-mango.md` lines 213-303).

## ✅ CORRECTIONS COMPLETED - Phase 2 Aligned with Plan

**Completion Date:** 2026-02-02
**Status:** All high-priority corrections completed

### Summary of Changes:

1. ✅ **API Routes Restructured** (Task #11)
   - Moved `/api/auth/verify-email/` → `/api/verify-email/`
   - Created `/api/verify-email/confirm/route.ts` for OTP verification
   - Renamed `/api/auth/signup/` → `/api/auth/register/`
   - Removed `/api/auth/resend-otp/` (consolidated into verify-email route)
   - Updated all page imports to use new routes

2. ✅ **6 Auth Components Created** (Task #12)
   - `components/auth/oauth-buttons.tsx`
   - `components/auth/login-form.tsx`
   - `components/auth/signup-form.tsx`
   - `components/auth/verify-otp-form.tsx`
   - `components/auth/forgot-password-form.tsx`
   - `components/auth/reset-password-form.tsx`

3. ✅ **Auth Provider Location Fixed** (Task #13)
   - Created `components/layout/auth-provider.tsx`
   - Updated `app/layout.tsx` to use new location
   - Removed old `components/providers/session-provider.tsx`

4. ✅ **Email Templates Aligned** (Tasks #8, #9, #10)
   - Renamed all templates to remove `-email` suffix
   - Created `access-granted.tsx` and `subscription-expiring.tsx`
   - All 6 email templates now match plan exactly

5. ✅ **Auth Utilities Consolidated** (Task #8)
   - Merged auth utilities into `lib/auth/utils.ts`
   - Renamed `auth.ts` → `config.ts`
   - Fixed SALT_ROUNDS to 10 (per plan)

6. ✅ **TypeScript and Build Issues Fixed**
   - Fixed Zod error handling (`error.errors` → `error.issues`)
   - Added PricingType enum imports in seed file
   - Fixed Prisma 7 + MariaDB adapter configuration
   - Added Suspense boundaries for `useSearchParams()` pages
   - All TypeScript checks passing

---

## Deviations from Plan (Documented & Accepted)

### 1. ✅ lib/auth/ File Structure (ACCEPTABLE DEVIATION)

**Decision:** Keep current structure (more maintainable)
**Rationale:** Better separation of concerns, easier testing

**Plan Requirement:**
```
lib/email/templates/
├── verification-otp.tsx
├── welcome.tsx
├── purchase-confirmation.tsx
├── access-granted.tsx
├── password-reset.tsx
└── subscription-expiring.tsx
```

**Current Implementation:**
```
lib/email/templates/
├── verification-email.tsx (should be: verification-otp.tsx)
├── welcome-email.tsx (should be: welcome.tsx)
├── purchase-confirmation-email.tsx (should be: purchase-confirmation.tsx)
├── password-reset-email.tsx (should be: password-reset.tsx)
└── [MISSING] access-granted.tsx
└── [MISSING] subscription-expiring.tsx
```

**Corrections Needed:**
1. Rename 4 existing files to match plan
2. Create 2 missing email templates

---

### 3. ❌ API Route Structure

**Plan Requirement:**
```
app/api/
├── verify-email/
│   ├── route.ts (Send OTP)
│   └── confirm/route.ts (Verify OTP)
└── auth/
    ├── register/route.ts (Signup)
    ├── forgot-password/route.ts
    └── reset-password/route.ts
```

**Current Implementation:**
```
app/api/auth/
├── [...nextauth]/route.ts ✅
├── signup/route.ts (should be: register)
├── verify-email/route.ts (should be: ../verify-email/)
├── resend-otp/route.ts (NOT in plan)
├── forgot-password/route.ts ✅
└── reset-password/route.ts ✅
```

**Corrections Needed:**
1. Move verify-email to `app/api/verify-email/route.ts`
2. Create `app/api/verify-email/confirm/route.ts`
3. Rename `signup` → `register`
4. Decision on `resend-otp` (remove or keep as improvement)

---

### 4. ❌ Auth Components - ALL MISSING

**Plan Requirement:**
```
components/auth/
├── login-form.tsx
├── signup-form.tsx
├── oauth-buttons.tsx
├── verify-otp-form.tsx
├── forgot-password-form.tsx
└── reset-password-form.tsx
```

**Current Implementation:**
```
components/auth/ (empty directory)
```

**Correction Needed:**
Extract forms from pages into separate components:
1. Extract login form from `/login/page.tsx`
2. Extract signup form from `/signup/page.tsx`
3. Extract OAuth button into reusable component
4. Extract OTP input from `/verify-email/page.tsx`
5. Extract forgot password form
6. Extract reset password form

---

### 5. ❌ Auth Provider Location

**Plan Requirement:**
```
components/layout/auth-provider.tsx
```

**Current Implementation:**
```
components/providers/session-provider.tsx
```

**Correction Needed:**
Move or create `components/layout/auth-provider.tsx`

---

### 6. ❌ Reset Password Page Route

**Plan Requirement:**
```
app/(auth)/reset-password/[token]/page.tsx
```

**Current Implementation:**
```
app/(auth)/reset-password/page.tsx (uses query param)
```

**Correction Needed:**
Change to dynamic route `[token]` instead of query param

---

## Correction Priority

### HIGH PRIORITY (Breaking Plan)
1. ✅ Create missing auth components (6 files)
2. ✅ Rename email templates to match plan
3. ✅ Create missing email templates (2 files)
4. ✅ Fix API route structure
5. ✅ Fix auth provider location

### MEDIUM PRIORITY (Structural)
6. ✅ Change reset password to use [token] dynamic route
7. ⚠️ Rename signup → register

### LOW PRIORITY (Acceptable Deviations)
8. ✅ Keep split auth files (otp, password, session)
9. ⚠️ Keep resend-otp route (UX improvement)

---

## Implementation Plan

### Step 1: Create Missing Email Templates
- [ ] Create `lib/email/templates/access-granted.tsx`
- [ ] Create `lib/email/templates/subscription-expiring.tsx`

### Step 2: Rename Email Templates
- [ ] Rename `verification-email.tsx` → `verification-otp.tsx`
- [ ] Rename `welcome-email.tsx` → `welcome.tsx`
- [ ] Rename `purchase-confirmation-email.tsx` → `purchase-confirmation.tsx`
- [ ] Rename `password-reset-email.tsx` → `password-reset.tsx`
- [ ] Update imports in `lib/email/send.ts`

### Step 3: Create Auth Components
- [ ] Create `components/auth/login-form.tsx`
- [ ] Create `components/auth/signup-form.tsx`
- [ ] Create `components/auth/oauth-buttons.tsx`
- [ ] Create `components/auth/verify-otp-form.tsx`
- [ ] Create `components/auth/forgot-password-form.tsx`
- [ ] Create `components/auth/reset-password-form.tsx`
- [ ] Update all auth pages to use new components

### Step 4: Fix API Route Structure
- [ ] Move `app/api/auth/verify-email/` → `app/api/verify-email/`
- [ ] Create `app/api/verify-email/confirm/route.ts`
- [ ] Rename `app/api/auth/signup/` → `app/api/auth/register/`
- [ ] Update all imports and references

### Step 5: Fix Auth Provider
- [ ] Create `components/layout/auth-provider.tsx`
- [ ] Update `app/layout.tsx` to use new location
- [ ] Keep or remove `components/providers/session-provider.tsx`

### Step 6: Fix Reset Password Route
- [ ] Create `app/(auth)/reset-password/[token]/page.tsx`
- [ ] Update forgot-password API to generate tokens
- [ ] Update email template with token link
- [ ] Remove old query param version

---

## Testing After Corrections

- [ ] All auth flows work (signup, login, verify, reset)
- [ ] Email templates render correctly
- [ ] API routes respond correctly
- [ ] Components render and validate properly
- [ ] No broken imports
- [ ] TypeScript compiles without errors
- [ ] All tests pass

---

## Git Strategy

After corrections:
```bash
git add -A
git commit -m "refactor: Align Phase 2 with main plan - fix file structure and naming

- Renamed email templates to match plan (removed -email suffix)
- Created missing email templates (access-granted, subscription-expiring)
- Created 6 auth components as per plan
- Fixed API route structure (verify-email at root, register instead of signup)
- Moved auth-provider to components/layout per plan
- Changed reset-password to use [token] dynamic route

Aligns with .claude/plans/dapper-nibbling-mango.md lines 213-303
"
git push origin main
```

---

## Notes

- Some "deviations" may be improvements (e.g., split auth files)
- Document which deviations to keep vs fix
- Update plan understanding if keeping beneficial changes
- Ensure sessions.md reflects actual implementation
