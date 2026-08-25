# Legacy Branding Policy — Internal Operational Document

> **Not legal advice.** Internal operational guidance for the Planet-Concord display rebrand. Active domain remains `https://codecraft.techsci.xyz` until a separately approved future phase.

## 1. Identity Hierarchy

- **Store/business identity:** **Planet-Concord** — `BRAND.businessName` / `BRAND.storeName`. Use for generic site identity, browser title template (`%s | Planet-Concord`), footer store references, generic public-site metadata, and legal-policy ownership where already approved.
- **Public product/community identity:** **Concord AI Ops** — `BRAND.publicBrandName`. Use only where public product/community voice is semantic (e.g., product-line messaging). Do not automatically replace every `CodeCraft` string with `Concord AI Ops` in shell/chrome.
- **Legal operator:** **TechSci, Inc.** — retained as legal operator in approved Terms and Privacy (`operated by TechSci, Inc.`), footer copyright (`© TechSci, Inc.`), and `COMPANY_INFO`. Do not rewrite as Planet-Concord DBA without legal approval.
- **Historical identity:** **CodeCraft / TechSci CodeCraft** — remains only in historical evidence, payment records, issued receipts, `LEGACY_BRAND` mapping, archived Git history, and dispute timelines. Never globally replace.

## 2. When Planet-Concord Must Be Used

- Root layout `app/layout.tsx` default/title template, `openGraph.siteName/title` alt, `twitter.title`
- Public header/footer logos (`components/layout/header.tsx`, `footer.tsx`)
- Customer dashboard and internal admin shells (`app/(dashboard)/dashboard/layout.tsx`, `app/(admin)/admin/layout.tsx`)
- Auth route metadata (`app/(auth)/layout.tsx`)
- Newly authored customer-facing support/policy/FAQ copy (via `BRAND.businessName`)

## 3. When Concord AI Ops May Be Used

- Only where the surface is explicitly the public product/community line (e.g., product hero or community badge) and the use has been approved as semantic. Not in global shell, not in legal operator clauses, not as a generic site-name replacement.

## 4. When TechSci, Inc. Must Remain

- Legal operator clauses in current approved `/terms` and `/privacy` (`operated by TechSci, Inc.`)
- Footer copyright (`© TechSci, Inc. — All rights reserved`)
- `TECHSCI` billing/merchant descriptor on statements
- `COMPANY_INFO` legal records and `Existing TechSci contact: hello@techsci.xyz` (company-information contact where required)
- `admin@techsci.xyz` as seed/admin auth identity (not customer support)

## 5. When CodeCraft Must Remain Historically

- `app/(admin)/admin/disputes/[purchaseId]/page.tsx` evidence log and rebuttal timeline
- `dispute-evidence/*` supporting documents
- `Purchase.whopPaymentId`, `Product.whopProductId` / `whopCheckoutUrl`, `productId`, `slug`, webhook event names (`invoice_paid`, `membership_activated`), Prisma `model`/`enum` names, `proxy.ts` guards
- `LEGACY_BRAND` mapping in `lib/brand.ts` for grep inventory
- Archived `SESSION.md` milestones and Git history — do not rewrite past milestones as Planet-Concord work

## 6. Active Domain During Transition

- **Current active domain:** `https://codecraft.techsci.xyz`
- `metadataBase`, canonical/OG `url`, `sitemap.ts`, `robots.ts`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, OAuth redirect `https://codecraft.techsci.xyz/api/auth/callback/google`, Whop/PayPal webhook URLs remain on `codecraft.techsci.xyz` until a separately approved infrastructure phase.
- No redirects, renames, or external integration changes in documentation phases.

## 7. Prohibited Public Claims

Do not introduce, preserve without flagging, or recommend:

- done-for-you custom systems, bespoke tailored or customized workflows for every buyer
- installation inside buyer accounts, requesting/retaining buyer passwords, API keys, secret tokens, payment credentials, or long-term access
- 1:1 onboarding calls as included in the $250 blueprint pack
- plug-and-play / ready-to-run without buyer-configuration context
- AI agents as a product category unless each product is verified
- revenue, lead, engagement, time-savings, growth, scale, six-figure, no-hire, customer-count, sales-count, or guarantee claims
- unverified architecture claims about blueprint internals

Current confirmed public offer is limited to: AI Operator Elite Setup — Make.com Blueprint Pack ($250 one-time), four prebuilt blueprints, written import guidance, 30 days Whop-chat support for import/setup/minor adjustments, buyer imports into own Make.com and maintains own third-party services/fees, 2–3 business days estimate not guarantee, non-exclusive non-transferable internal license, no resale/redistribution. Legacy 10-product catalog remains operational but unredefined.

## 8. Safe Handling of Credentials and Customer Data

- Never request or store customer passwords, API keys, secret tokens, payment credentials, or long-term account access via email or Whop chat (per `lib/legal/policies.ts` Terms §6 / Privacy §4).
- Never expose `DATABASE_URL`, `WHOP_WEBHOOK_SECRET`, `WHOP_API_KEY`, `PAYPAL_*`, `RESEND_API_KEY`, `SENTRY_DSN`, customer `email`/`whopPaymentId`, Drive links, or delivery URLs in code, docs, logs, or commits.
- Historical receipts, payment records, and dispute evidence are immutable.
- New customer-facing support/policy email is `planet.concord0@gmail.com` only for newly authored copy; do not use `zobairhossain0@gmail.com`.

## 9. Verification

- `grep -R "CodeCraft" --include="*.tsx" app/layout.tsx components/layout` should be 0 post-Phase 2 (verified)
- `grep -R "planet.concord0@gmail.com" --include="*.md" README.md CLAUDE.md` should show new support email where approved
- `bun run lint` / `bunx tsc --noEmit` / `bun run build` must pass with `metadataBase` still `codecraft.techsci.xyz`

---
*Internal operational document — not legal advice. For legal operator or domain changes, require separate legal/owner approval.*
