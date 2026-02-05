/**
 * Site-wide constants and configuration
 * Centralized configuration for TechSci CodeCraft Agency
 */

export const SITE_CONFIG = {
  name: "TechSci CodeCraft Agency",
  shortName: "CodeCraft",
  description:
    "Premium digital marketing and development products to accelerate your business growth",
  url: "https://codecraft.techsci.xyz",
  domain: "codecraft.techsci.xyz",
  tagline: "Elevate Your Digital Presence",
} as const;

export const CONTACT_INFO = {
  email: "support@techsci.xyz",
  adminEmail: "admin@techsci.xyz",
  salesEmail: "sales@techsci.xyz",
  phone: "+1 (555) 123-4567", // Update with real phone if available
} as const;

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/techsci",
  linkedin: "https://linkedin.com/company/techsci",
  github: "https://github.com/techsci",
  youtube: "https://youtube.com/@techsci",
} as const;

export const NAVIGATION = {
  main: [
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    products: [
      { label: "All Products", href: "/products" },
      { label: "Marketing", href: "/products?category=marketing" },
      { label: "Analytics", href: "/products?category=analytics" },
      { label: "Development", href: "/products?category=development" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
} as const;

export const PRODUCT_CATEGORIES = {
  MARKETING: {
    slug: "marketing",
    label: "Marketing",
    description: "Boost your marketing efforts with proven strategies",
    icon: "TrendingUp", // Lucide icon name
  },
  ANALYTICS: {
    slug: "analytics",
    label: "Analytics",
    description: "Data-driven insights for better decisions",
    icon: "BarChart3",
  },
  DEVELOPMENT: {
    slug: "development",
    label: "Development",
    description: "Technical solutions for your business",
    icon: "Code2",
  },
} as const;

export const WHOP_CONFIG = {
  companyId: process.env.WHOP_COMPANY_ID || "biz_DVtB8NOUFdLlX0",
  apiKey: process.env.WHOP_API_KEY || "",
  webhookSecret: process.env.WHOP_WEBHOOK_SECRET || "",
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  keywords: [
    "digital products",
    "marketing tools",
    "analytics",
    "development",
    "business growth",
    "SaaS",
  ],
  ogImage: "/images/CODE_CRAFT_LOGO.png",
  twitterHandle: "@techsci",
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  contactForm: {
    max: 3, // 3 requests
    window: 60 * 60, // per hour
  },
  newsletter: {
    max: 5,
    window: 24 * 60 * 60, // per day
  },
  api: {
    max: 100,
    window: 60, // per minute
  },
} as const;

// Company information
export const COMPANY_INFO = {
  legalName: "TechSci, Inc.",
  registeredState: "Delaware",
  corporationType: "Delaware C-Corp",
  ein: "35-2800827",
  foundedYear: 2024,
  address: {
    street: "651 N Broad St, Suite 201",
    city: "Middletown",
    state: "DE",
    zip: "19709",
    country: "United States",
  },
  contactEmail: "hello@techsci.xyz",
} as const;
