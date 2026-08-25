/**
 * Planet-Concord — Centralized Semantic Brand Configuration
 * Phase 1 (transitional display rebrand) — approved 2026-02-?? (see docs/brand-spec.md)
 *
 * Domain remains https://codecraft.techsci.xyz — no integration/URL changes in this phase.
 * Legal entity remains TechSci, Inc. (EIN 35-2800827) — see COMPANY_INFO in lib/constants.ts.
 * Merchant/statement descriptor TECHSCI unchanged — do not use BRAND fields for payment evidence.
 *
 * Intentional surface mapping (use appropriate field, not a 1:1 SITE_CONFIG rename):
 * - businessName/storeName (Planet-Concord): generic site identity, store references, browser titles where "store" applies
 * - publicBrandName (Concord AI Ops): public product/community messaging
 * - supportEmail (planet.concord0@gmail.com): newly written customer-facing support/policy/FAQ/email-template copy
 * - xHandle/whopStorefrontUrl/primaryCheckoutUrl: external presence links — verify before exposing in UI (Phase 2+)
 *
 * Backward compatibility: lib/constants.ts SITE_CONFIG, CONTACT_INFO, SOCIAL_LINKS, COMPANY_INFO remain unchanged
 * in Phase 1 and continue to drive runtime (metadataBase, sitemap, emails, dispute evidence). Future phases will
 * migrate surfaces one-by-one to these semantic fields with explicit file lists.
 */

export const BRAND = {
  /** Canonical business/store identity — use for generic site/store references */
  businessName: "Planet-Concord",

  /** Public product/community brand — use for product/community messaging surfaces */
  publicBrandName: "Concord AI Ops",

  /** Store/storefront display name — currently same as businessName */
  storeName: "Planet-Concord",

  /** Customer-facing support/policy contact for newly written copy (Phase 2+). Do not change Resend infrastructure in Phase 1. */
  supportEmail: "planet.concord0@gmail.com",

  /** X (Twitter) handle for public presence */
  xHandle: "@planetconcord",

  /** Whop storefront URL — external, do not auto-link without Phase 2 review */
  whopStorefrontUrl: "https://whop.com/planet-concord",

  /** Primary paid-offer checkout URL — AI Operator Elite Setup ($250 one-time, Make.com Blueprint Pack) */
  primaryCheckoutUrl: "https://whop.com/checkout/plan_nPTFAu3OuDrON",
} as const;

export type BrandConfig = typeof BRAND;

/**
 * Legacy brand inventory — retained for grep later phases, historical evidence, and dispute archival.
 * Do not use for new copy. Kept here to make legacy surface explicit without modifying runtime.
 */
export const LEGACY_BRAND = {
  name: "TechSci CodeCraft Agency",
  shortName: "CodeCraft",
  domain: "codecraft.techsci.xyz",
  url: "https://codecraft.techsci.xyz",
  supportEmail: "support@techsci.xyz",
  billingDescriptor: "TECHSCI",
  statementDescriptorAlt: "CodeCraft Agency",
  legalName: "TechSci, Inc.",
} as const;

/**
 * Helper to get brand string for a semantic surface.
 * Prefer direct BRAND.field access; this exists only for future surface-routing if needed.
 */
export type BrandSurface = "store" | "product" | "community";

export function getBrandForSurface(surface: BrandSurface): string {
  switch (surface) {
    case "store":
      return BRAND.storeName;
    case "product":
    case "community":
      return BRAND.publicBrandName;
    default:
      return BRAND.businessName;
  }
}
