# Planet-Concord — Brand Specification (Phase 1 Approved)

**Status:** `APPROVE PHASE 1 ONLY` — centralized semantic brand config, constrained display rebrand.
**Authoritative decisions source:** User approval 2026 — mapped verbatim below.
**Domain mode:** Display rebrand only — active app domain stays `https://codecraft.techsci.xyz`.
**Implementation:** `lib/brand.ts` (semantic), `lib/constants.ts` (legacy retained, re-export additive).

---

## 1. Brand Mapping (verbatim)

- **Business/store name:** `Planet-Concord`
- **Public product/community brand:** `Concord AI Ops`
- **X handle:** `@planetconcord`
- **Whop storefront:** `https://whop.com/planet-concord`
- **Main paid-offer checkout URL:** `https://whop.com/checkout/plan_nPTFAu3OuDrON`
- **Support and policy contact email (newly written copy):** `planet.concord0@gmail.com`

**Explicit forbidden:** Do not use `zobairhossain0@gmail.com` anywhere.

**Semantic fields — do not collapse to simplistic `SITE_CONFIG.name/shortName`:**

| Field | Value | Intent |
|-------|-------|--------|
| `businessName` | `Planet-Concord` | Generic browser/site identity, store references |
| `publicBrandName` | `Concord AI Ops` | Public product/community messaging surfaces |
| `storeName` | `Planet-Concord` | Store/storefront display name |
| `supportEmail` | `planet.concord0@gmail.com` | Customer-facing support/policy/FAQ/email-template copy (new) |
| `xHandle` | `@planetconcord` | Social presence |
| `whopStorefrontUrl` | `https://whop.com/planet-concord` | External Whop presence |
| `primaryCheckoutUrl` | `https://whop.com/checkout/plan_nPTFAu3OuDrON` | Main paid offer checkout |

**Rule:** Use appropriate field intentionally by surface — generic/store → `Planet-Concord`, product/community → `Concord AI Ops`.
Do not alter legal entity, merchant descriptor, payment evidence, or historical records.

**Canonical export:** `lib/brand.ts:BRAND` (`as const`) + `BrandConfig` type. See file header for surface guidance and legacy inventory.

---

## 2. Domain Decision (frozen for Phase 1)

Keep `https://codecraft.techsci.xyz` as active application domain.

**Display rebrand only — Do NOT in this phase:**
- change `NEXTAUTH_URL`
- change `NEXT_PUBLIC_APP_URL`
- change `metadataBase` URL/domain unless it can remain `codecraft.techsci.xyz`
- change OAuth redirect URIs
- change Vercel domains
- change Whop or PayPal webhook URLs
- change sitemap domains
- create redirects
- rename or modify any external integration

Standalone Planet-Concord web domain is a **separately approved future phase**.

**Implementation consequence:** `app/layout.tsx:metadataBase`, `lib/constants.ts:SITE_CONFIG.url/domain`, `app/sitemap.ts`, `app/robots.ts`, `NEXTAUTH_URL` remain `codecraft.techsci.xyz`.

---

## 3. Email and Payment Decision

For **all newly written** customer-facing support, policy, contact, FAQ, and relevant email-template copy:
- use `planet.concord0@gmail.com`
- do not use `zobairhossain0@gmail.com`

**Do not change in this phase:**
- technical sender infrastructure
- authenticated Resend domain / `RESEND_FROM_EMAIL` env
- provider configuration / email environment variables
- payment merchant descriptor / billing descriptor

**Keep `TechSci` / `TECHSCI` where required for:**
- legal entity references
- historical receipts
- payment descriptors (`TECHSCI` / `CodeCraft Agency` on statements)
- dispute evidence
- previously issued transactional evidence

If a visible sender display name can safely change without infra change, propose exact change for review before implementing (deferred to Phase 4).

---

## 4. Legal Entity Decision

Retain existing legal entity, EIN, address, and legal/payment identity:
- `TechSci, Inc.`
- Existing `EIN 35-2800827`
- Existing address `651 N Broad St, Suite 201, Middletown, DE 19709`
- Existing `TECHSCI` billing descriptor

**Do not in this phase:**
- rewrite legal pages (`/terms`, `/privacy`, `/refund`)
- claim Planet-Concord is a different incorporated legal entity or DBA
- alter historical dispute evidence (`app/(admin)/admin/disputes/[purchaseId]/page.tsx`)

---

## 5. Asset Decision

Do not create placeholders, download assets, generate logos, delete legacy assets, or rename image files in this phase.

- Keep existing visual assets temporarily if abstract/non-textual.
- Replace only clearly visible old-brand text in UI where approved — **none approved in Phase 1**.
- Flag text embedded inside image assets for later dedicated asset-design phase.

**Current assets retained:** `public/images/CODE_CRAFT_LOGO.png`, `CODE_CRAFT_BANNAR.png`. New logo `planet-concord-logo.png` is a future Phase 7 asset.

---

## 6. Product Catalog Decision — Option C: Transitional Rebrand

For now:
- Rebrand **shared application identity, app shell, customer-facing support/contact references, and high-level public company identity** — deferred to later phases.
- Do **not** delete, hide, reorder, rewrite, or promote the existing 10-product catalog.
- Do **not** modify product IDs, slugs, Whop IDs, PayPal linkage, seeded prices, subscription behavior, product access, webhooks, or existing purchases.
- Do **not** add unsupported claims to any product page.
- Create a **separate decision report** identifying catalog entries that conflict with the Planet-Concord blueprint-pack offer — **not in Phase 1**.

**Confirmed offer language (inventory only — do not insert into pages in Phase 1):**
- **AI Operator Elite Setup — Make.com Blueprint Pack**
- `$250` one-time
- Four prebuilt `Make.com` blueprint files
- Customer imports into their own `Make.com` account
- Customer reconnects and maintains their own third-party accounts
- Written import guidance
- 30 days of support for import questions, setup issues, and minor adjustments
- Typical delivery: `2–3 business days`, an estimate only
- No custom installation, no guaranteed results, no 1:1 onboarding call, no performance claims

Do not insert this offer into existing public product pages in Phase 1.

---

## 7. Approval Scope — Phase 1 Constrained

**Approved:**
1. Add/update centralized semantic brand constants/configuration (`lib/brand.ts`, `lib/constants.ts` re-export additive).
2. Add version-controlled brand specification document (this file).
3. Update only shared identity references required for the new configuration to exist — **none beyond additive constants in Phase 1**.

**Explicitly not in Phase 1:**
- global layouts, public pages, SEO metadata, email templates, legal pages, admin/dashboard labels, assets, docs, database seed data, or external configuration — unless strictly necessary to compile (none were).

**Invariants preserved:**
- domains, URLs, integrations, credentials, IDs, database models, webhooks, payment flows, historical evidence — all untouched.

---

## 8. Implementation Log — Phase 1

- `lib/brand.ts` — **created** — semantic `BRAND`, `LEGACY_BRAND`, `getBrandForSurface`, `BrandConfig` type, header docs.
- `lib/constants.ts` — **updated (additive)** — header comment references `lib/brand.ts`, `COMPANY_INFO` comment clarifies legal entity unchanged, bottom re-export `BRAND`/`BrandConfig`. `SITE_CONFIG` / `CONTACT_INFO` / `SOCIAL_LINKS` values unchanged.
- `docs/brand-spec.md` — **created** — this document.

**Validation (Phase 1):** `bun run lint`, `bunx tsc --noEmit`, `bun run build` — no consumer switched to `BRAND` yet, so runtime unchanged. Focused brand grep is inventory for later phases, not an error.

---

## 9. Next Phases (not approved)

- **Phase 2:** App shell (`app/layout.tsx`, header/footer) — propose exact display-name change for review.
- **Phase 3:** Public pages/SEO metadata — `SITE_CONFIG.url` remains codecraft until domain phase.
- **Phase 4:** Email templates — use `BRAND.supportEmail` for new copy, propose sender display-name change separately.
- **Phase 5:** Legal pages — no rewrite until legal review, retain `TechSci, Inc.`.
- **Phase 7:** Assets — `planet-concord-logo.png` creation when brand assets approved.
- **Phase 9:** Domain cutover — standalone Planet-Concord domain, redirects, Vercel/OAuth/Whop re-registration.

**No further changes without explicit `APPROVE PHASE <n>`.**
