/**
 * Planet-Concord — Shared Legal Policy Content (Phase 1.5)
 * Operational policy drafts — not legal advice. See docs/brand-spec.md.
 *
 * - Source: Approved policy text (Aug 25, 2026) with editorial corrections A-D.
 * - Operator identity: Planet-Concord operated by TechSci, Inc. (Option B) — LEGAL REVIEW retained as comment.
 * - Contact: planet.concord0@gmail.com (public). TechSci descriptor/history unchanged elsewhere.
 * - No raw HTML / dangerouslySetInnerHTML — semantic LegalSection data only.
 */

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const LAST_UPDATED = "August 25, 2026";
export const POLICY_CONTACT_EMAIL = "planet.concord0@gmail.com";

// LEGAL REVIEW NOTE: Operator phrasing below uses TechSci, Inc. per Phase 1.5 Option B.
// Whop seller identity should be confirmed as TechSci, Inc. before public deployment.

// ——————————————————————————————————————————————
// Terms and Conditions — 12 sections + Contact
// Corrections applied: A (Section 2), B (Section 6), C (Section 12), D (operator via TechSci, Inc.)
// ——————————————————————————————————————————————
export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "about-these-terms",
    title: "1. About These Terms",
    paragraphs: [
      "These Terms and Conditions govern access to and use of products and services offered by Planet-Concord (“we,” “us,” or “our”), operated by TechSci, Inc., offers products and services through Whop. By purchasing, accessing, or using a product or service, you agree to these Terms.",
    ],
  },
  {
    id: "products-and-services",
    title: "2. Products and Services",
    paragraphs: [
      "Planet-Concord may offer prebuilt Make.com automation blueprints, workflow templates, written import guidance, optional configuration services where expressly described, and post-delivery support. The specific deliverables, whether customization is included, and the delivery method are stated on the applicable product page at the time of purchase.",
    ],
  },
  {
    id: "payment",
    title: "3. Payment",
    paragraphs: [
      "Prices are listed in U.S. dollars unless otherwise stated. Payment is processed through Whop. By purchasing, you authorize Whop to charge your selected payment method for the amount shown at checkout, including any applicable taxes.",
    ],
  },
  {
    id: "service-delivery",
    title: "4. Service Delivery and Timelines",
    paragraphs: [
      "Any stated delivery timeline is an estimate, not a guarantee. Delivery may depend on the product scope, customer-provided information, third-party platform availability, technical complexity, scope changes, and customer responsiveness.",
    ],
  },
  {
    id: "customer-responsibilities",
    title: "5. Customer Responsibilities",
    paragraphs: [
      "You agree to provide accurate information relevant to your purchase and to respond to reasonable support or setup questions promptly. Delays caused by missing or inaccurate information, unavailable accounts, or customer unresponsiveness may extend delivery time.",
    ],
  },
  {
    id: "account-connections",
    title: "6. Customer Account Connections and Third-Party Costs",
    paragraphs: [
      "Customers are responsible for connecting and maintaining their own Make.com, Google, Slack, Instagram, Telegram, and other third-party accounts. Planet-Concord does not request or retain customer passwords, payment credentials, API keys, secret tokens, or long-term account access unless a separate written agreement explicitly states otherwise. Customers are responsible for applicable third-party subscription costs, fees, account permissions, and compliance obligations.",
    ],
  },
  {
    id: "refunds",
    title: "7. Refunds",
    paragraphs: [
      "Refund eligibility is governed by the Return and Refund Policy posted on the Planet-Concord store page at the time of purchase.",
    ],
  },
  {
    id: "license-ip",
    title: "8. License and Intellectual Property",
    paragraphs: [
      "Unless otherwise agreed in writing, Planet-Concord retains ownership of its templates, blueprints, workflows, and proprietary automation frameworks. Customers receive a non-exclusive, non-transferable license to use delivered materials for their own internal business operations. Customers may not resell, sublicense, redistribute, publish, or represent the materials as their own without written permission.",
    ],
  },
  {
    id: "no-guarantee",
    title: "9. No Guarantee of Results",
    paragraphs: [
      "Planet-Concord provides tools, templates, and systems to support business automation. We do not guarantee revenue, lead volume, engagement, time savings, business growth, or any other specific outcome.",
    ],
  },
  {
    id: "disclaimer-limitation",
    title: "10. Disclaimer and Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, services are provided “as is” and “as available” without warranties of any kind. Planet-Concord is not liable for indirect, incidental, special, or consequential damages arising from use of products or services. Our total liability for a claim will not exceed the amount paid for the applicable product or service.",
    ],
  },
  {
    id: "platform-terms",
    title: "11. Platform Terms",
    paragraphs: [
      "Some services are delivered through Whop. Your access is governed by both these Terms and Whop’s applicable terms and policies.",
    ],
  },
  {
    id: "governing-law",
    title: "12. Governing Law and Changes",
    paragraphs: [
      "These Terms are governed by the laws of Bangladesh, except where applicable law requires otherwise. We may update these Terms from time to time. The version posted at the time of purchase governs that order, subject to applicable law.",
    ],
  },
];

// ——————————————————————————————————————————————
// Return and Refund Policy — 7 sections + Contact
// ——————————————————————————————————————————————
export const REFUND_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    paragraphs: [
      "This Return and Refund Policy applies to one-time purchases of Make.com automation blueprint packs, workflow templates, optional setup services, and other digital products offered by Planet-Concord through Whop.",
    ],
  },
  {
    id: "before-delivery",
    title: "2. Before Digital Delivery or Work Begins",
    paragraphs: [
      "You may request a full refund by contacting us through Whop support chat before any blueprint files, product access, onboarding materials, custom work, or other digital deliverables have been sent or made available to you.",
    ],
  },
  {
    id: "after-delivery",
    title: "3. After Delivery or Work Begins",
    paragraphs: [
      "Once digital materials have been delivered, access has been granted, or custom work has begun, purchases are generally final. If delivered materials do not substantially match the applicable product description or an agreed written scope, contact us through Whop support chat. We will review the issue and work to resolve it.",
    ],
  },
  {
    id: "non-delivery",
    title: "4. Non-Delivery",
    paragraphs: [
      "If Planet-Concord fails to deliver the purchased materials or agreed service within a reasonable timeframe, excluding delays caused by missing customer information, unavailable third-party accounts, technical limitations outside our control, scope changes, or customer unresponsiveness, you may be eligible for a full refund.",
    ],
  },
  {
    id: "how-to-request",
    title: "5. How to Request a Refund",
    paragraphs: [
      "Submit your request through Whop support chat and include your order details and a clear description of the issue. We aim to review refund requests within 5 business days.",
    ],
  },
  {
    id: "chargebacks",
    title: "6. Chargebacks and Payment Disputes",
    paragraphs: [
      "Please contact us through Whop support chat before filing a payment dispute. This gives us an opportunity to review and resolve the issue promptly. Nothing in this policy limits any rights you may have under applicable law.",
    ],
  },
  {
    id: "changes",
    title: "7. Changes to This Policy",
    paragraphs: [
      "We may update this policy from time to time. The version posted on the store page at the time of purchase governs that order.",
    ],
  },
];

// ——————————————————————————————————————————————
// Privacy Policy — 8 sections + Contact
// ——————————————————————————————————————————————
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "Planet-Concord (“we,” “us,” or “our”), operated by TechSci, Inc., respects your privacy. This Privacy Policy explains how we collect, use, retain, and protect information when you purchase or use our products and services through Whop.",
    ],
  },
  {
    id: "information-collect",
    title: "2. Information We Collect",
    paragraphs: [
      "We may collect purchase and account information made available through Whop, business and workflow information you voluntarily provide for support or optional setup services, and communications exchanged through Whop support chat or email. Payment processing is handled by Whop; we do not directly store full payment card details.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Information",
    paragraphs: [
      "We use information only as reasonably necessary to deliver and support purchased products or services, communicate about orders, provide requested setup assistance, improve our offerings, prevent fraud or abuse, resolve disputes, and comply with legal obligations.",
    ],
  },
  {
    id: "credentials",
    title: "4. Customer Credentials and Automation Connections",
    paragraphs: [
      "We do not request or store customers’ account passwords, API keys, secret tokens, or payment credentials. Where a workflow requires third-party connections, customers reconnect their own accounts through the relevant third-party platform. Do not send passwords, API keys, secret tokens, or payment information through Whop chat or email.",
    ],
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing",
    paragraphs: [
      "We do not sell personal information. We may share information with Whop, service providers strictly necessary to deliver a requested service, or authorities when required by law.",
    ],
  },
  {
    id: "retention-rights",
    title: "6. Data Retention and Your Rights",
    paragraphs: [
      "We retain information only as long as reasonably necessary to deliver services, meet legal obligations, prevent fraud, and resolve disputes. Depending on your location, you may have rights to request access, correction, or deletion of personal information, subject to applicable law.",
    ],
  },
  {
    id: "security-third-parties",
    title: "7. Security and Third Parties",
    paragraphs: [
      "We take reasonable measures to protect information, but no online transmission or storage method is completely secure. Our products may reference or connect to third-party tools or services. Their privacy practices are governed by their own policies.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    paragraphs: [
      "We may update this policy periodically. The version posted at the time of purchase or use applies, subject to applicable law.",
    ],
  },
];
