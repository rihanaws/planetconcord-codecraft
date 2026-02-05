import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { PricingType } from "@prisma/client";

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed passwords must be set via env vars — see .env.example
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const customerPwd = process.env.SEED_CUSTOMER_PASSWORD;
  if (!adminPassword || !customerPwd) {
    throw new Error("SEED_ADMIN_PASSWORD and SEED_CUSTOMER_PASSWORD must be set before running seed");
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techsci.xyz" },
    update: {},
    create: {
      email: "admin@techsci.xyz",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      name: "Admin User",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Additional admin accounts
  const additionalAdmins = [
    { email: "codecraka@gmail.com", name: "Codecraka" },
    { email: "rihan@afilo.io", name: "Rihan" },
    { email: "sayem.rihan13@gmail.com", name: "Sayem Rihan" },
  ];

  for (const adminData of additionalAdmins) {
    const user = await prisma.user.upsert({
      where: { email: adminData.email },
      update: { role: "ADMIN", name: adminData.name },
      create: {
        email: adminData.email,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
        name: adminData.name,
      },
    });
    console.log("✅ Admin user created:", user.email);
  }

  // Create 6 products
  const products = [
    {
      name: "Email Newsletter Starter Pack",
      slug: "email-newsletter-starter-pack",
      description: `Launch your email newsletter with confidence! This comprehensive starter pack includes everything you need to build, grow, and monetize your subscriber list.

**What You'll Get:**
- 12 Pre-written newsletter templates (Welcome, Weekly, Monthly formats)
- Email list building strategies and growth hacks
- Monetization playbook (5 proven revenue streams)
- Subject line formulas that get 40%+ open rates
- Canva templates for newsletter graphics
- Email service provider comparison guide
- Legal compliance checklist (CAN-SPAM, GDPR)

**Perfect For:**
- Content creators starting their first newsletter
- Bloggers expanding into email marketing
- Coaches building their audience
- Anyone wanting to grow their email list from zero

**Results You Can Expect:**
With our proven templates and strategies, you'll be able to launch your newsletter in just 48 hours and start building your subscriber list immediately.`,
      shortDesc: "Everything you need to launch and grow your email newsletter from scratch, including templates, strategies, and monetization playbook.",
      price: 149,
      pricingType: PricingType.ONE_TIME,
      category: "Marketing",
      deliverables: [
        "12 pre-written newsletter templates",
        "Email growth strategy guide (PDF)",
        "Subject line formula cheat sheet",
        "Canva design templates",
        "Monetization playbook",
        "Legal compliance checklist"
      ],
      features: [
        "Proven templates that convert",
        "Copy-paste ready content",
        "Growth strategies from 6-figure newsletters",
        "Lifetime access to all templates",
        "Free updates and new templates"
      ],
      requirements: [
        "Email service provider account (free options available)",
        "Canva account (free version works)",
        "Basic understanding of your target audience"
      ],
      faq: [
        {
          question: "Do I need technical skills?",
          answer: "No! Everything is designed for beginners. If you can copy and paste, you can use these templates."
        },
        {
          question: "What email platforms do these work with?",
          answer: "These templates work with all major platforms: Mailchimp, ConvertKit, Substack, Beehiiv, and more."
        },
        {
          question: "How long does it take to launch?",
          answer: "With our templates, you can launch your newsletter in 48 hours or less."
        }
      ],
      whopProductId: "plan_8UNXo1N0bptfZ",
      whopCheckoutUrl: "https://whop.com/checkout/plan_8UNXo1N0bptfZ",
      featured: true,
      popular: true,
    },
    {
      name: "Landing Page CRO Boost",
      slug: "landing-page-cro-boost",
      description: `Double your landing page conversions with our battle-tested CRO (Conversion Rate Optimization) system. Based on analyzing 500+ high-converting landing pages.

**What You'll Get:**
- Complete landing page audit framework (23-point checklist)
- 15 high-converting landing page templates
- Copywriting formulas for each page section
- A/B testing playbook with 50+ test ideas
- Psychology-based design principles
- Trust signal implementation guide
- Mobile optimization checklist
- Analytics setup guide

**Perfect For:**
- SaaS founders wanting more signups
- Course creators selling digital products
- Agencies managing client landing pages
- Anyone spending on ads but not converting

**Results You Can Expect:**
Our clients typically see 2-3x conversion rate improvements within 30 days of implementing our recommendations.`,
      shortDesc: "Battle-tested CRO system to double your landing page conversions, including templates, copywriting formulas, and A/B testing playbook.",
      price: 597,
      pricingType: PricingType.ONE_TIME,
      category: "Marketing",
      deliverables: [
        "23-point CRO audit framework",
        "15 landing page templates (Figma)",
        "Copywriting formula guide",
        "A/B testing playbook",
        "Psychology & design principles guide",
        "Analytics setup tutorial"
      ],
      features: [
        "Battle-tested on 500+ landing pages",
        "Science-backed psychology principles",
        "Ready-to-implement improvements",
        "Works for any industry",
        "Lifetime access with free updates"
      ],
      requirements: [
        "Existing landing page (or willingness to create one)",
        "Access to page analytics",
        "Basic familiarity with your page builder"
      ],
      faq: [
        {
          question: "How fast will I see results?",
          answer: "Most clients see measurable improvements within 7-14 days of implementing the audit recommendations."
        },
        {
          question: "Do I need design skills?",
          answer: "No! The templates are ready to use, and the audit framework tells you exactly what to change."
        },
        {
          question: "Will this work for my industry?",
          answer: "Yes! These principles work across all industries - we've tested them on SaaS, e-commerce, courses, services, and more."
        }
      ],
      whopProductId: "plan_G48izi0ZI4ObP",
      whopCheckoutUrl: "https://whop.com/checkout/plan_G48izi0ZI4ObP",
      featured: true,
      popular: false,
    },
    {
      name: "Social Media Content Calendar",
      slug: "social-media-content-calendar",
      description: `Never run out of content ideas again! This comprehensive 90-day social media content calendar includes post templates, captions, and scheduling strategies.

**What You'll Get:**
- 90-day content calendar (270+ post ideas)
- Platform-specific templates (Instagram, LinkedIn, Twitter, Facebook)
- Caption formulas and hashtag strategies
- Visual content ideas and examples
- Engagement-boosting techniques
- Content batching workflow
- Scheduling tools guide

**Perfect For:**
- Small business owners managing their own social media
- Content creators wanting consistency
- Marketers needing fresh ideas
- Anyone struggling with content creation

**Results You Can Expect:**
Post consistently for 3 months straight without creative burnout, plus build sustainable content systems for long-term success.`,
      shortDesc: "90-day social media content calendar with 270+ post ideas, templates, captions, and engagement strategies across all major platforms.",
      price: 199,
      pricingType: PricingType.ONE_TIME,
      category: "Marketing",
      deliverables: [
        "90-day content calendar (Google Sheets)",
        "270+ post ideas across platforms",
        "Caption templates & formulas",
        "Hashtag research guide",
        "Visual content examples",
        "Content batching workflow"
      ],
      features: [
        "Platform-specific strategies",
        "Mix of educational, promotional, and engaging content",
        "Editable and customizable",
        "Evergreen content that stays relevant",
        "Lifetime access with quarterly updates"
      ],
      requirements: [
        "Active social media accounts",
        "Basic knowledge of your target audience",
        "Willingness to show up consistently"
      ],
      faq: [
        {
          question: "Can I customize the content for my brand?",
          answer: "Absolutely! Every post idea is a template you can customize to fit your brand voice and audience."
        },
        {
          question: "Which platforms are covered?",
          answer: "Instagram, LinkedIn, Twitter/X, Facebook, and TikTok. Strategies are included for each platform's unique algorithm."
        },
        {
          question: "What if I don't have time to post daily?",
          answer: "The calendar is flexible! You can adapt it to post 3x/week, 5x/week, or daily - whatever fits your schedule."
        }
      ],
      whopProductId: "plan_Wl6CH4o7Xqu8j",
      whopCheckoutUrl: "https://whop.com/checkout/plan_Wl6CH4o7Xqu8j",
      featured: false,
      popular: true,
    },
    {
      name: "Growth Accelerator Package",
      slug: "growth-accelerator-package",
      description: `The complete digital marketing system for scaling your business. This subscription gives you access to our entire library of templates, tools, and training.

**What You'll Get:**
- All current and future marketing templates
- Monthly live strategy calls (recorded)
- Private community access
- Weekly resource drops
- Priority email support
- Quarterly playbook updates
- Done-for-you swipe files

**Included Resources:**
- Email marketing templates
- Social media calendars
- Landing page templates
- Ad copy frameworks
- SEO optimization guides
- Content strategy playbooks
- Sales funnel blueprints

**Perfect For:**
- Growing businesses needing comprehensive marketing resources
- Agencies serving multiple clients
- Marketers wanting ongoing training and support
- Anyone serious about scaling their marketing

**Results You Can Expect:**
Access to the same marketing systems used by 7-figure businesses, updated monthly with fresh strategies and templates.`,
      shortDesc: "Complete digital marketing subscription with all templates, tools, training, monthly strategy calls, and private community access.",
      price: 599.67,
      pricingType: PricingType.SUBSCRIPTION,
      category: "Marketing",
      deliverables: [
        "Access to full template library (100+)",
        "Monthly live strategy calls",
        "Private community membership",
        "Weekly resource updates",
        "Quarterly playbook releases",
        "Done-for-you swipe files",
        "Priority support"
      ],
      features: [
        "Everything in one place",
        "New content added weekly",
        "Live expert guidance monthly",
        "Network with other growth-focused marketers",
        "Cancel anytime",
        "Download and keep all templates"
      ],
      requirements: [
        "Active business or marketing role",
        "Commitment to implementing strategies",
        "Internet connection for live calls"
      ],
      faq: [
        {
          question: "Can I cancel anytime?",
          answer: "Yes! Cancel anytime with no questions asked. You'll keep access until the end of your billing period."
        },
        {
          question: "How often is new content added?",
          answer: "New templates and resources are added weekly. Major playbooks are updated quarterly."
        },
        {
          question: "What if I miss a live call?",
          answer: "All calls are recorded and added to the member library within 24 hours."
        }
      ],
      whopProductId: "plan_XRw3y2MVK0bGV",
      whopCheckoutUrl: "https://whop.com/checkout/plan_XRw3y2MVK0bGV",
      featured: true,
      popular: true,
    },
    {
      name: "RealEstate AI Video Review",
      slug: "realestate-ai-video-review",
      description: `AI-powered video analysis tool designed specifically for real estate professionals. Get actionable insights on your property videos, virtual tours, and listing presentations.

**What You'll Get:**
- Automated video quality analysis
- Viewer engagement metrics
- Content optimization recommendations
- Competitor benchmarking
- Performance tracking dashboard
- Monthly detailed reports

**Analysis Includes:**
- Video quality score (lighting, framing, pacing)
- Engagement prediction (estimated watch time)
- SEO optimization for video titles/descriptions
- Property highlight effectiveness
- Call-to-action performance
- Mobile viewing optimization

**Perfect For:**
- Real estate agents creating listing videos
- Property managers with virtual tours
- Real estate marketers
- Anyone creating property content

**Results You Can Expect:**
Increase video engagement by 40%+ and generate more qualified leads from your property listings.`,
      shortDesc: "AI-powered video analysis tool for real estate professionals with quality scoring, engagement metrics, and optimization recommendations.",
      price: 29.99,
      pricingType: PricingType.SUBSCRIPTION,
      category: "Analytics",
      deliverables: [
        "Unlimited video analysis",
        "Real-time quality scoring",
        "Engagement predictions",
        "Monthly performance reports",
        "Competitor benchmarking",
        "Optimization recommendations"
      ],
      features: [
        "AI-powered insights specific to real estate",
        "Easy video upload process",
        "Instant analysis results",
        "Track improvements over time",
        "Export reports for clients",
        "Mobile-friendly dashboard"
      ],
      requirements: [
        "Property videos to analyze",
        "Internet connection",
        "Modern web browser"
      ],
      faq: [
        {
          question: "How many videos can I analyze?",
          answer: "Unlimited! Analyze as many videos as you want with your subscription."
        },
        {
          question: "How long does analysis take?",
          answer: "Most videos are analyzed in under 2 minutes."
        },
        {
          question: "Do you store my videos?",
          answer: "Videos are analyzed and then deleted. We only store the analysis results, not the actual video files."
        }
      ],
      whopProductId: "plan_H5T9fyNzL0Wxp",
      whopCheckoutUrl: "https://whop.com/checkout/plan_H5T9fyNzL0Wxp",
      featured: false,
      popular: false,
    },
    {
      name: "Shopify Speed Surge",
      slug: "shopify-speed-surge",
      description: `Professional Shopify store optimization service to dramatically improve your store's loading speed. Fast stores convert better and rank higher in Google.

**What You'll Get:**
- Complete speed audit and analysis
- Image optimization (all product images)
- Code optimization and cleanup
- App audit and recommendations
- Theme optimization
- Mobile performance boost
- Before/after speed reports

**Optimization Includes:**
- Image compression and lazy loading
- JavaScript/CSS minification
- Theme code cleanup
- Unnecessary app removal guidance
- Cache optimization
- Mobile-first improvements
- Google PageSpeed optimization

**Perfect For:**
- Shopify store owners with slow load times
- Stores with high bounce rates
- Anyone wanting better SEO rankings
- Stores preparing for high-traffic events

**Results You Can Expect:**
Average improvement of 40-60% in PageSpeed score, leading to higher conversions and better search rankings.`,
      shortDesc: "Professional Shopify store optimization service to dramatically improve loading speed, conversions, and search rankings.",
      price: 500,
      pricingType: PricingType.ONE_TIME,
      category: "Development",
      deliverables: [
        "Complete speed audit report",
        "Image optimization (all products)",
        "Code optimization",
        "Theme performance improvements",
        "App recommendations",
        "Before/after speed comparison",
        "Maintenance guide"
      ],
      features: [
        "Done-for-you service",
        "Guaranteed speed improvements",
        "No ongoing fees",
        "Works with any Shopify theme",
        "30-day support included",
        "Risk-free (we backup everything)"
      ],
      requirements: [
        "Shopify store (any plan)",
        "Admin access to your store",
        "List of must-keep apps/features"
      ],
      faq: [
        {
          question: "How long does optimization take?",
          answer: "Most stores are optimized within 3-5 business days."
        },
        {
          question: "Will you break my store?",
          answer: "No! We create complete backups before starting and test everything thoroughly."
        },
        {
          question: "What if I'm not happy with the results?",
          answer: "We guarantee measurable improvements. If we can't improve your speed score, we'll refund 100%."
        }
      ],
      whopProductId: "plan_1qJMDMW3n3REa",
      whopCheckoutUrl: "https://whop.com/checkout/plan_1qJMDMW3n3REa",
      featured: false,
      popular: false,
    },
    {
      name: "SEO Master Toolkit",
      slug: "seo-master-toolkit",
      description: `Dominate search engine rankings with our comprehensive SEO toolkit. Built from real-world audits across hundreds of websites, this toolkit gives you every resource you need to improve organic traffic.

**What You'll Get:**
- 30-point technical SEO audit checklist
- On-page optimization playbook
- 10 backlink outreach email templates
- Keyword research framework (seed → expand → prioritize)
- Local SEO playbook for brick-and-mortar businesses
- Schema markup implementation guide

**Perfect For:**
- Website owners wanting more organic traffic
- Digital marketers running SEO campaigns
- Local businesses competing for search visibility
- Anyone wanting to understand how search engines work

**Results You Can Expect:**
Follow our framework and see measurable ranking improvements within 60-90 days. Most users report 30-50% organic traffic growth in the first quarter.`,
      shortDesc: "Comprehensive SEO toolkit with technical audit checklists, on-page guides, backlink outreach templates, and keyword research frameworks.",
      price: 299,
      pricingType: PricingType.ONE_TIME,
      category: "SEO",
      deliverables: [
        "Technical SEO audit checklist (30-point)",
        "On-page optimization guide",
        "Backlink outreach templates (10)",
        "Keyword research framework",
        "Local SEO playbook",
        "Schema markup guide",
      ],
      features: [
        "Comprehensive technical + on-page coverage",
        "Works for any website or niche",
        "Actionable step-by-step guides",
        "Real-world outreach email templates",
        "Includes local SEO for brick-and-mortar businesses",
      ],
      requirements: [
        "A website you want to optimize",
        "Access to Google Search Console",
        "Basic understanding of how search engines work",
      ],
      faq: [
        {
          question: "How long will it take to see results?",
          answer: "SEO is a long-term game — most users see measurable improvements within 60-90 days of implementing the audit recommendations.",
        },
        {
          question: "Do I need coding skills?",
          answer: "No! The guides are written for non-technical website owners. Schema markup is the only section that involves code, and we walk you through it step by step.",
        },
        {
          question: "Is this for local or national SEO?",
          answer: "Both! We include a dedicated Local SEO playbook for businesses targeting geographic areas, plus general guides for national or niche sites.",
        },
      ],
      whopProductId: "",
      whopCheckoutUrl: "",
      featured: true,
      popular: false,
    },
    {
      name: "Email Automation Playbook",
      slug: "email-automation-playbook",
      description: `Transform your email marketing with proven automation sequences that nurture leads and drive sales on autopilot. Platform-agnostic — works with any ESP.

**What You'll Get:**
- 5 copy-paste email sequences (welcome, lead magnet, re-engagement, and more)
- Welcome series (7-email sequence with timing)
- Lead magnet delivery flow
- Re-engagement campaign (5-email win-back)
- Visual automation workflow diagrams
- A/B testing guide for emails

**Perfect For:**
- Small businesses wanting to automate their email marketing
- Course creators nurturing leads
- SaaS founders building onboarding flows
- Anyone with an email list ready to scale

**Results You Can Expect:**
Proven sequences with real benchmarks: 35%+ open rates on welcome series, 3-5x revenue lift from abandoned cart sequences.`,
      shortDesc: "Platform-agnostic email automation playbook with copy-paste sequences, workflow diagrams, and A/B testing guides for any ESP.",
      price: 249,
      pricingType: PricingType.ONE_TIME,
      category: "Email",
      deliverables: [
        "5 copy-paste email sequences",
        "Welcome series (7-email)",
        "Lead magnet delivery flow",
        "Re-engagement campaign",
        "Automation workflow diagrams",
        "A/B testing guide for emails",
      ],
      features: [
        "Platform-agnostic (Mailchimp, ConvertKit, ActiveCampaign, etc.)",
        "Copy-paste ready email sequences",
        "Visual workflow diagrams included",
        "Proven sequences with real open/click benchmarks",
        "Lifetime access with quarterly updates",
      ],
      requirements: [
        "An email service provider account",
        "An existing email list (or plan to build one)",
        "Basic familiarity with your ESP's automation features",
      ],
      faq: [
        {
          question: "Can I use these with any ESP?",
          answer: "Yes! All sequences are written in plain text with send-timing guidance. Just copy the subject lines and body copy into your platform's automation builder.",
        },
        {
          question: "How long does it take to set up?",
          answer: "Most users have their first automation live within 2-3 hours of starting. The welcome series is the easiest to set up first.",
        },
        {
          question: "Will these work for B2B too?",
          answer: "Absolutely. We include B2B-specific tips in each sequence. The welcome series and re-engagement campaigns work especially well for B2B.",
        },
      ],
      whopProductId: "",
      whopCheckoutUrl: "",
      featured: false,
      popular: true,
    },
    {
      name: "Paid Ads Master Class",
      slug: "paid-ads-master-class",
      description: `Master paid advertising across Google, Facebook, Instagram, and TikTok with campaign templates and frameworks used by 7-figure brands. Budget-friendly strategies starting at $500/month.

**What You'll Get:**
- Google Ads campaign templates (Search + Shopping)
- Facebook/Instagram creative framework
- Retargeting playbook (3-stage funnel)
- Budget allocation calculator
- Ad copy formula sheet (50+ formulas)
- Weekly performance reporting template

**Perfect For:**
- Business owners ready to invest in paid ads
- Marketing managers scaling ad budgets
- E-commerce brands looking for more sales
- Anyone wanting to learn paid advertising from scratch

**Results You Can Expect:**
Real campaign structures that achieve 3x+ ROAS. Start small at $500/month and scale profitably using our proven frameworks.`,
      shortDesc: "Complete paid ads playbook covering Google, Facebook, Instagram, and TikTok with campaign templates, budget calculators, and retargeting playbooks.",
      price: 449,
      pricingType: PricingType.ONE_TIME,
      category: "Ads",
      deliverables: [
        "Google Ads campaign templates (Search + Shopping)",
        "Facebook/Instagram creative framework",
        "Retargeting playbook (3-stage funnel)",
        "Budget allocation calculator",
        "Ad copy formula sheet (50+ formulas)",
        "Weekly performance reporting template",
      ],
      features: [
        "Covers Google, Facebook, Instagram, and TikTok basics",
        "Budget-friendly strategies starting at $500/month",
        "Real campaign structures used by 7-figure brands",
        "Includes creative brief templates for designers",
        "Ongoing weekly reporting framework",
      ],
      requirements: [
        "A business with a product or service to sell",
        "A budget of at least $500/month for ad spend",
        "Access to Google Ads and/or Meta Business Suite",
      ],
      faq: [
        {
          question: "Do I need prior ad experience?",
          answer: "No! The playbook starts from absolute basics — setting up accounts, understanding bidding, and writing your first ad. We hold your hand through it all.",
        },
        {
          question: "Can I start with just one platform?",
          answer: "Yes! We recommend starting with either Google Ads (best for high-intent buyers) or Facebook/Instagram (best for awareness). Pick one and master it first.",
        },
        {
          question: "How much budget do I need to start?",
          answer: "We recommend $500/month minimum to get statistically meaningful data. Our budget allocation calculator helps you split spend optimally across platforms.",
        },
      ],
      whopProductId: "",
      whopCheckoutUrl: "",
      featured: true,
      popular: true,
    },
    {
      name: "E-Commerce Conversion Kit",
      slug: "e-commerce-conversion-kit",
      description: `Increase your e-commerce conversion rate with data-driven frameworks backed by conversion research. Platform-agnostic — works with Shopify, WooCommerce, BigCommerce, and custom stores.

**What You'll Get:**
- Product page optimization checklist (25-point)
- Checkout flow improvement guide
- Cart abandonment email sequence (3-email)
- Trust signals implementation guide
- Pricing psychology playbook
- Mobile conversion optimization guide

**Perfect For:**
- E-commerce store owners with room to improve
- Shopify merchants wanting more sales
- Anyone launching a new online store
- Marketers optimizing existing funnels

**Results You Can Expect:**
Industry benchmarks show 2-4x conversion improvements after implementing our full checklist. Even partial implementation typically yields 20-40% lift.`,
      shortDesc: "Platform-agnostic e-commerce conversion toolkit with product page checklists, pricing psychology, cart recovery emails, and mobile optimization guides.",
      price: 349,
      pricingType: PricingType.ONE_TIME,
      category: "E-Commerce",
      deliverables: [
        "Product page optimization checklist (25-point)",
        "Checkout flow improvement guide",
        "Cart abandonment email sequence (3-email)",
        "Trust signals implementation guide",
        "Pricing psychology playbook",
        "Mobile conversion optimization guide",
      ],
      features: [
        "Platform-agnostic (Shopify, WooCommerce, BigCommerce, custom)",
        "Data-driven frameworks backed by conversion research",
        "Includes before/after case studies",
        "Cart recovery email templates included",
        "Covers mobile-first optimization strategies",
      ],
      requirements: [
        "An existing e-commerce store",
        "Access to your store's analytics (Google Analytics or equivalent)",
        "Basic ability to edit your store's pages",
      ],
      faq: [
        {
          question: "Does this work for digital products too?",
          answer: "Yes! While many examples use physical products, the conversion principles (trust signals, pricing psychology, checkout flow) apply equally to digital products and courses.",
        },
        {
          question: "How much can I expect conversions to improve?",
          answer: "Results vary, but most stores see 20-40% improvement after implementing the full checklist. Cart recovery emails alone typically recover 5-15% of abandoned carts.",
        },
        {
          question: "Do I need a developer?",
          answer: "Not for most of it! The checklist and guides are designed for store owners. Only the schema markup section might need developer help, and we provide copy-paste code.",
        },
      ],
      whopProductId: "",
      whopCheckoutUrl: "",
      featured: false,
      popular: false,
    },
  ];

  console.log("📦 Creating products...");

  const DISCORD_INVITE = "https://discord.gg/unz5hBd5";

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        whopProductId: productData.whopProductId,
        whopCheckoutUrl: productData.whopCheckoutUrl,
        discordInviteUrl: DISCORD_INVITE,
      },
      create: { ...productData, discordInviteUrl: DISCORD_INVITE },
    });
    console.log(`✅ Product created: ${product.name}`);
  }

  // --- Seed ContentItems per product ---
  console.log("📄 Seeding content items...");

  const contentBySlug: Record<string, { type: "FILE" | "LINK" | "TEXT" | "VIDEO"; title: string; description: string; textContent?: string; linkUrl?: string; videoUrl?: string; fileUrl?: string; fileName?: string; fileSize?: number; order: number }[]> = {
    "email-newsletter-starter-pack": [
      { type: "TEXT", title: "Getting Started Guide", description: "Step-by-step walkthrough to launch your newsletter in 48 hours.", textContent: "# Getting Started with Your Newsletter\n\n## Step 1: Choose Your Platform\nPick an email service provider (Mailchimp, ConvertKit, Beehiiv).\n\n## Step 2: Set Up Your Welcome Series\nUse the 3-email welcome sequence in the templates folder.\n\n## Step 3: Design Your First Issue\nDrag and drop using the Canva templates provided.\n\n## Step 4: Grow Your List\nApply the 5 list-building strategies from the growth playbook.\n\n## Step 5: Monetize\nIntroduce sponsorships after reaching 500 subscribers using the monetization playbook.", order: 0 },
      { type: "LINK", title: "Canva Newsletter Templates", description: "Access 12 pre-designed newsletter layouts in Canva.", linkUrl: "https://www.canva.com/newsletters/", order: 1 },
      { type: "VIDEO", title: "Newsletter Launch Masterclass", description: "60-minute video covering setup, writing, and growth strategies.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 2 },
      { type: "TEXT", title: "Subject Line Formula Cheat Sheet", description: "50 proven subject line formulas that get 40%+ open rates.", textContent: "# Subject Line Formulas\n\n## The Curiosity Gap\n\"You won't believe what happened when...\"\n\n## The Number Promise\n\"5 ways to double your open rate this week\"\n\n## The Personalization Play\n\"Hey {first_name}, this is just for you\"\n\n## The Urgency Driver\n\"Last chance: [offer] expires tonight\"\n\n## The Controversial Take\n\"Unpopular opinion: email newsletters are dead... unless you do this\"", order: 3 },
    ],
    "landing-page-cro-boost": [
      { type: "TEXT", title: "23-Point CRO Audit Framework", description: "Complete checklist to audit and optimize any landing page.", textContent: "# 23-Point CRO Audit\n\n## Above the Fold (Points 1-8)\n1. **Headline clarity** — Can a stranger understand your offer in 3 seconds?\n2. **Value proposition** — Is the main benefit stated explicitly?\n3. **Visual hierarchy** — Does your eye go to the CTA first?\n4. **Hero image/video** — Does it reinforce the message?\n5. **Social proof** — Are logos or testimonials visible?\n6. **CTA button contrast** — Does it stand out from the background?\n7. **Trust signals** — Badges, reviews, guarantee icons?\n8. **Mobile viewport** — Does it look good on a 320px screen?\n\n## Body & Flow (Points 9-16)\n9. **Feature benefits** — Listed as benefits, not features?\n10. **Testimonial specificity** — Do they include real numbers?\n11. **FAQ coverage** — Common objections addressed?\n12. **Scroll depth** — Is content balanced across sections?\n13. **Internal links** — Are there distractions away from the page?\n14. **Load speed** — Under 3 seconds on mobile?\n15. **Form length** — Minimum fields only?\n16. **Progress indicators** — Multi-step forms guided?\n\n## Conversion & Trust (Points 17-23)\n17. **Guarantee visibility** — Is the risk reversal prominent?\n18. **Privacy policy link** — Present near forms?\n19. **Payment security badges** — Visible near checkout?\n20. **Exit-intent handling** — Pop-up or offer on leave?\n21. **A/B test readiness** — Analytics tracking set up?\n22. **Heatmap analysis** — User attention mapped?\n23. **Post-conversion flow** — Thank you page optimized?", order: 0 },
      { type: "VIDEO", title: "A/B Testing Masterclass", description: "Learn how to run statistically significant A/B tests on your landing page.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Google Optimize Setup Guide", description: "Step-by-step guide to setting up A/B tests with Google tools.", linkUrl: "https://support.google.com/analytics/answer/9845427", order: 2 },
      { type: "TEXT", title: "Copywriting Formula Playbook", description: "Proven copy frameworks for headlines, subheads, and CTAs.", textContent: "# Copywriting Formulas\n\n## Headlines\n- **PAS**: Problem → Agitate → Solve\n- **AIDA**: Attention → Interest → Desire → Action\n- **Before/After**: Show the transformation\n\n## CTAs\n- Action + Benefit: \"Start Your Free Trial → Get 30 Days Free\"\n- Urgency + Value: \"Claim Your Spot → Only 3 Left\"\n- Risk Reversal: \"Try Risk-Free → 30-Day Money Back\"", order: 3 },
    ],
    "social-media-content-calendar": [
      { type: "TEXT", title: "Content Batching Workflow", description: "How to create a full week of social content in one 2-hour session.", textContent: "# Content Batching Workflow\n\n## Phase 1: Ideation (20 min)\n- Pick 3 content pillars (e.g., Educational, Inspirational, Promotional)\n- Generate 7 ideas, one per day\n- Map each idea to a content type (carousel, reel, story, post)\n\n## Phase 2: Writing (40 min)\n- Write all 7 captions using the formula templates\n- Add relevant hashtag sets (3-5 per post)\n- Draft alt text for each image\n\n## Phase 3: Design (30 min)\n- Use Canva batch mode — duplicate template, swap content\n- Export all 7 visuals in one go\n- Create Story variations if needed\n\n## Phase 4: Schedule (10 min)\n- Upload all posts to your scheduler (Buffer, Later, etc.)\n- Set optimal posting times per platform\n- Double-check links and mentions", order: 0 },
      { type: "VIDEO", title: "Instagram Reels Strategy 2024", description: "How to create viral Reels that grow your following fast.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Buffer Social Scheduling Tool", description: "Schedule and manage all your social media in one place.", linkUrl: "https://buffer.com", order: 2 },
      { type: "LINK", title: "Canva Social Media Kit", description: "Free social media templates for all platforms.", linkUrl: "https://www.canva.com/social-media-templates/", order: 3 },
    ],
    "growth-accelerator-package": [
      { type: "TEXT", title: "Digital Marketing Playbook Q1", description: "Comprehensive quarterly strategy covering email, social, ads, and SEO.", textContent: "# Growth Accelerator — Q1 Playbook\n\n## Month 1: Foundation\n- Audit current marketing channels\n- Set up tracking (GA4, UTM parameters)\n- Define target audience personas\n- Launch email welcome series\n\n## Month 2: Amplification\n- Scale top-performing content\n- Launch first paid campaign (Facebook/Instagram)\n- Implement SEO on top 10 landing pages\n- Start weekly newsletter cadence\n\n## Month 3: Optimization\n- A/B test top 3 ad creatives\n- Optimize email sequences based on open/click data\n- Increase ad budget on winning campaigns by 50%\n- Launch referral program\n\n## KPI Targets\n- Email: 25% open rate, 3% click rate\n- Ads: ROAS > 3x\n- Organic: 20% traffic increase\n- Referrals: 10 new signups", order: 0 },
      { type: "VIDEO", title: "Facebook Ads Masterclass", description: "How to set up and scale profitable Facebook ad campaigns.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "SEO Audit Tool — Ahrefs", description: "Professional SEO analysis and competitor benchmarking.", linkUrl: "https://ahrefs.com", order: 2 },
      { type: "TEXT", title: "Sales Funnel Blueprint", description: "Step-by-step funnel architecture from awareness to purchase.", textContent: "# Sales Funnel Blueprint\n\n## Top of Funnel (Awareness)\n- Blog posts targeting informational keywords\n- Social media educational content\n- YouTube tutorials\n- Lead magnet (free checklist/template)\n\n## Middle of Funnel (Consideration)\n- Email nurture sequence (5-7 emails)\n- Case studies and testimonials\n- Webinar or live demo\n- Comparison guides\n\n## Bottom of Funnel (Decision)\n- Product page with social proof\n- Limited-time offer or bonus\n- FAQ addressing top objections\n- Money-back guarantee\n\n## Post-Purchase\n- Onboarding email series\n- Upsell/cross-sell sequence\n- Referral program invitation\n- Feedback survey at day 30", order: 3 },
      { type: "VIDEO", title: "Weekly Strategy Call — Jan 15", description: "Recorded strategy call covering Q1 priorities and action items.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 4 },
    ],
    "realestate-ai-video-review": [
      { type: "TEXT", title: "Video Optimization Guide", description: "How to score higher on our AI analysis with proven techniques.", textContent: "# Optimizing Your Real Estate Videos\n\n## Lighting\n- Shoot during golden hour (1 hour after sunrise / before sunset)\n- Use natural light — open all curtains\n- Avoid harsh overhead fluorescent lights\n- Score target: 8/10+\n\n## Framing & Composition\n- Use rule of thirds for key rooms\n- Always shoot in landscape (16:9)\n- Include wide establishing shots before close-ups\n- Stabilize your camera — use a tripod or gimbal\n\n## Pacing\n- Keep clips between 3-8 seconds\n- Start with the most impressive room\n- End with the exterior/neighborhood\n- Total video: 60-120 seconds is the sweet spot\n\n## Audio\n- Use upbeat, royalty-free background music\n- Avoid recording ambient noise if it's distracting\n- Add voiceover for key selling points", order: 0 },
      { type: "VIDEO", title: "Real Estate Video Masterclass", description: "Professional techniques for filming stunning property tours.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Royalty-Free Music for Property Videos", description: "Download free background music optimized for real estate content.", linkUrl: "https://www.pixabay.com/music/", order: 2 },
    ],
    "seo-master-toolkit": [
      { type: "TEXT", title: "Technical SEO Audit Checklist", description: "30-point checklist covering crawlability, indexing, performance, and mobile.", textContent: "# Technical SEO Audit Checklist\n\n## Crawlability (Points 1-8)\n1. **Robots.txt** — Is it accessible at /robots.txt? Are the right pages allowed/disallowed?\n2. **Sitemap** — Is your sitemap submitted to Google Search Console?\n3. **Crawl errors** — Check GSC for any 404s or server errors\n4. **Broken links** — Use a crawler to find internal broken links\n5. **Redirect chains** — Are there 301 chains longer than 1 hop?\n6. **Canonical tags** — Are duplicate pages properly canonicalized?\n7. **Noindex tags** — Are any important pages accidentally noindexed?\n8. **Internal links** — Are orphan pages linked from somewhere?\n\n## Indexing (Points 9-14)\n9. **Index coverage** — How many pages are indexed vs. total?\n10. **Duplicate content** — Run a plagiarism check across your own pages\n11. **Thin content** — Are any indexed pages under 200 words?\n12. **Structured data** — Is schema markup valid and rendering?\n13. **Hreflang** — If multilingual, are hreflang tags correct?\n14. **URL structure** — Are URLs short, descriptive, and hyphenated?\n\n## Performance (Points 15-22)\n15. **Core Web Vitals** — Check LCP, FID, CLS scores\n16. **Page speed** — Mobile load time under 3 seconds?\n17. **Image optimization** — All images compressed and in WebP?\n18. **Render-blocking resources** — Any CSS/JS blocking the above-the-fold?\n19. **Server response time** — Under 200ms?\n20. **Caching** — Browser and server caching enabled?\n21. **Compression** — Gzip or Brotli enabled?\n22. **CDN** — Are static assets served via CDN?\n\n## Mobile (Points 23-30)\n23. **Mobile-friendly test** — Does Google's test pass?\n24. **Viewport meta tag** — Present and correct?\n25. **Touch targets** — All buttons/links at least 48px?\n26. **Font sizes** — Minimum 16px base on mobile?\n27. **Horizontal scrolling** — No overflow on mobile?\n28. **Pop-ups** — Not intrusive on mobile (Google penalty)?\n29. **Interstitials** — None on mobile entry?\n30. **App install banners** — Properly implemented if applicable?", order: 0 },
      { type: "LINK", title: "Ahrefs SEO Tool", description: "Industry-leading SEO analysis and backlink research platform.", linkUrl: "https://ahrefs.com", order: 1 },
      { type: "VIDEO", title: "SEO Fundamentals Masterclass", description: "Comprehensive video covering how search engines work and core SEO principles.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 2 },
      { type: "TEXT", title: "Keyword Research Framework", description: "4-step process to find and prioritize keywords that drive traffic.", textContent: "# Keyword Research Framework\n\n## Step 1: Seed Keywords\n- Start with 5-10 topics your business covers\n- Ask: \"What would my ideal customer search for?\"\n- Write down every variation you can think of\n- Example: \"Shopify store\" → shopify store speed, shopify optimization, shopify theme performance\n\n## Step 2: Expand\n- Use Google autocomplete for each seed keyword\n- Check \"People also ask\" boxes\n- Use tools: Ahrefs, Semrush, or free alternatives like Ubersuggest\n- Target: 50-100 keyword candidates\n\n## Step 3: Analyze Intent\nCategorize each keyword by search intent:\n- **Informational**: How to, what is, guide (→ blog post)\n- **Navigational**: Brand names, specific URLs (→ landing page)\n- **Commercial**: Best, review, compare (→ comparison page)\n- **Transactional**: Buy, price, discount (→ product page)\n\n## Step 4: Prioritize\nScore each keyword on:\n- **Volume**: Monthly searches (higher = more potential)\n- **Difficulty**: Competition level (lower = easier to rank)\n- **Intent match**: How well it aligns with what you offer\n- **Business value**: How likely to convert\n\nPrioritize keywords with the best combination of volume + low difficulty + high business value.", order: 3 },
      { type: "LINK", title: "Google Search Console", description: "Free tool to monitor your site's search performance and fix issues.", linkUrl: "https://search.google.com/search-console", order: 4 },
    ],
    "email-automation-playbook": [
      { type: "TEXT", title: "Welcome Series Blueprint", description: "7-email welcome sequence with subject lines and optimal send timing.", textContent: "# Welcome Series Blueprint\n\n## Email 1: Immediate Delivery (0 min)\n**Subject:** \"Welcome to [Brand] — here's what happens next\"\nGoal: Set expectations, deliver any lead magnet\nKey elements: Thank you, what they'll get, link to resource\n\n## Email 2: The Origin Story (1 hour)\n**Subject:** \"Why we built [Brand]\"\nGoal: Build trust and brand connection\nKey elements: Your story, mission, what makes you different\n\n## Email 3: Quick Win (Day 2)\n**Subject:** \"The one thing that changed everything for us\"\nGoal: Deliver immediate value\nKey elements: One actionable tip, proof of results\n\n## Email 4: Social Proof (Day 3)\n**Subject:** \"What [customer name] did with [product]\"\nGoal: Show results others have achieved\nKey elements: Case study or testimonial, specific numbers\n\n## Email 5: Address Objections (Day 5)\n**Subject:** \"I get it — you're probably wondering...\"\nGoal: Handle common doubts\nKey elements: FAQ format, direct and honest answers\n\n## Email 6: The Offer (Day 7)\n**Subject:** \"Your special invitation\"\nGoal: Convert subscribers to customers\nKey elements: Clear offer, limited-time bonus, CTA\n\n## Email 7: The Gentle Nudge (Day 10)\n**Subject:** \"Still thinking about it?\"\nGoal: Final push for conversion\nKey elements: Reminder of value, urgency, easy CTA\n\n## Timing Tips\n- Emails 1-3: Front-load value to reduce churn\n- Gap between 3-5: Let them absorb\n- Emails 6-7: Close together for urgency", order: 0 },
      { type: "VIDEO", title: "Automation Setup Masterclass", description: "Step-by-step video on building email automations in popular ESPs.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Mailchimp Automation Docs", description: "Official Mailchimp guide to setting up automation workflows.", linkUrl: "https://mailchimp.com/help/automation/", order: 2 },
      { type: "TEXT", title: "Re-engagement Campaign Playbook", description: "5-email win-back sequence with timing and conditions for inactive subscribers.", textContent: "# Re-engagement Campaign Playbook\n\n## When to Trigger\n- Subscriber hasn't opened an email in 60+ days\n- Or hasn't clicked in 90+ days\n- Run this BEFORE removing them from your list\n\n## Email 1: The Check-In (Day 0)\n**Subject:** \"Haven't heard from you in a while\"\nGoal: Gentle re-engagement\nContent: Acknowledge the gap, remind them of value\n\n## Email 2: What's New (Day 3)\n**Subject:** \"A lot has changed — here's what you missed\"\nGoal: Show they're missing out\nContent: Highlight 3 recent updates/wins\n\n## Email 3: Exclusive Offer (Day 5)\n**Subject:** \"This is just for you\"\nGoal: Incentivize re-engagement\nContent: Free bonus, discount, or exclusive content\n\n## Email 4: Last Chance (Day 8)\n**Subject:** \"Should I remove you from the list?\"\nGoal: Create urgency (honest, not manipulative)\nContent: Clear choice: stay or unsubscribe\n\n## Email 5: Goodbye (Day 12)\n**Subject:** \"I understand\"\nGoal: Leave door open\nContent: Warm goodbye, easy way to come back\n\n## After the Sequence\n- Opened + clicked → back to main list\n- Opened but didn't click → one more email, then remove\n- Never opened → remove from list (protects deliverability)", order: 3 },
      { type: "LINK", title: "ConvertKit Automations", description: "Learn how to build powerful automations in ConvertKit.", linkUrl: "https://convertkit.com/features/automations", order: 4 },
    ],
    "paid-ads-master-class": [
      { type: "TEXT", title: "Ad Budget Allocation Guide", description: "Framework for splitting ad spend across platforms and funnel stages.", textContent: "# Ad Budget Allocation Guide\n\n## The Golden Rule\nNever put all your budget in one basket. Diversify across platforms AND funnel stages.\n\n## Recommended Split by Platform\n- **Google Ads (Search):** 40% — highest purchase intent\n- **Facebook/Instagram:** 35% — best for awareness + retargeting\n- **TikTok:** 15% — growing audience, lower CPMs\n- **Reserve:** 10% — for testing new ideas\n\n## Split by Funnel Stage\n- **Top of Funnel (Awareness):** 30%\n  - Goal: Reach new audiences\n  - Channels: Facebook/Instagram video ads, TikTok\n- **Middle of Funnel (Consideration):** 40%\n  - Goal: Educate and qualify leads\n  - Channels: Google Search, Facebook/Instagram carousel\n- **Bottom of Funnel (Conversion):** 30%\n  - Goal: Drive purchases\n  - Channels: Google Shopping, retargeting ads\n\n## Starting Budget ($500/month)\n- Google Ads Search: $200\n- Facebook/Instagram: $175\n- Testing budget: $125\n\n## Scaling Rules\n- If ROAS > 3x for 7 days → increase budget by 20%\n- If CPA is 2x target for 3 days → pause and optimize\n- Never increase budget by more than 20% at a time\n- Always keep 10% aside for experimentation", order: 0 },
      { type: "VIDEO", title: "Google Ads Search Campaigns", description: "Complete walkthrough of setting up and optimizing Google Search campaigns.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Meta Ads Library", description: "Browse and research competitor ads across Facebook and Instagram.", linkUrl: "https://www.facebook.com/ads/library/", order: 2 },
      { type: "TEXT", title: "Retargeting Playbook", description: "3-stage retargeting funnel: awareness retarget, consideration retarget, cart abandonment.", textContent: "# Retargeting Playbook\n\n## Why Retargeting Works\nPeople who visited your site are 10x more likely to convert than cold audiences. Retargeting keeps you top-of-mind.\n\n## Stage 1: Awareness Retarget\n**Audience:** Site visitors who didn't convert (last 30 days)\n**Ad Type:** Video or carousel showing your best content\n**Message:** \"Still thinking about [solution]? Here's why [Brand] is different.\"\n**Frequency:** 3-5x per week\n**Duration:** Show for 7 days after visit\n\n## Stage 2: Consideration Retarget\n**Audience:** People who visited product/pricing pages but didn't buy\n**Ad Type:** Social proof (reviews, case studies)\n**Message:** \"Others are already seeing results with [product].\"\n**Frequency:** 5-7x per week\n**Duration:** Show for 14 days\n\n## Stage 3: Cart Abandonment\n**Audience:** Added to cart but didn't complete purchase\n**Ad Type:** Dynamic product ad + incentive\n**Message:** \"You left something behind — here's 10% off to finish.\"\n**Frequency:** 2-3x per day for first 48 hours, then 1x/day\n**Duration:** 7 days max\n\n## Frequency Caps\nDon't annoy people! Set caps:\n- Awareness: max 5x/week\n- Consideration: max 7x/week\n- Cart abandonment: max 3x/day\n\n## Exclude converted customers from all retargeting!", order: 3 },
      { type: "VIDEO", title: "Writing High-Converting Ad Copy", description: "Techniques and formulas for writing ad copy that actually converts.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 4 },
    ],
    "e-commerce-conversion-kit": [
      { type: "TEXT", title: "Product Page Optimization Checklist", description: "25-point checklist covering hero image, copy, social proof, CTA, trust signals, and mobile.", textContent: "# Product Page Optimization Checklist\n\n## Hero Section (Points 1-5)\n1. **Hero image quality** — High-res, lifestyle shot showing product in use\n2. **Product title** — Clear, includes primary keyword\n3. **Price visibility** — Prominent, no hidden fees mentioned nearby\n4. **Primary CTA** — \"Add to Cart\" button above the fold, high-contrast color\n5. **Social proof snippet** — Star rating + review count near the top\n\n## Copy & Content (Points 6-12)\n6. **Benefit-focused description** — Lead with benefits, not features\n7. **Bullet points** — Key selling points in scannable format\n8. **Storytelling** — Short paragraph about WHY this product matters\n9. **Specifications** — Detailed specs in a collapsible section\n10. **Size/variant guide** — Clear guidance on choosing the right option\n11. **Keyword optimization** — Natural use of target keywords\n12. **Alt text** — Descriptive alt text on all product images\n\n## Social Proof (Points 13-17)\n13. **Reviews section** — Prominently placed, sortable\n14. **Photo reviews** — Encourage and display customer photos\n15. **Review count** — Show total number of reviews\n16. **Verified purchase badge** — Adds credibility\n17. **Video testimonials** — If available, include above the fold\n\n## Trust & Conversion (Points 18-22)\n18. **Money-back guarantee** — Clearly stated with icon\n19. **Shipping info** — Delivery time and free shipping threshold\n20. **Security badges** — SSL, payment method logos\n21. **FAQ accordion** — Common questions answered\n22. **Urgency indicators** — \"Only 3 left\" or \"X people viewing\" (if truthful)\n\n## Mobile (Points 23-25)\n23. **Sticky add-to-cart** — CTA visible while scrolling on mobile\n24. **Image zoom** — Pinch-to-zoom on mobile\n25. **Touch-friendly** — All interactive elements 48px+ tap targets", order: 0 },
      { type: "VIDEO", title: "Checkout Flow Optimization", description: "Video walkthrough on reducing friction in the checkout experience.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Hotjar Heatmaps", description: "See exactly where users click, scroll, and drop off on your pages.", linkUrl: "https://www.hotjar.com", order: 2 },
      { type: "TEXT", title: "Pricing Psychology Playbook", description: "6 techniques: anchoring, charm pricing, decoy effect, bundling, loss aversion, social proof.", textContent: "# Pricing Psychology Playbook\n\n## Technique 1: Anchoring\nShow a higher \"original\" price crossed out next to your actual price.\n- Before: \"$49\" → After: \"~~$99~~ $49\" — perceived value doubles\n- Works because humans judge value relative to a reference point\n- Be honest: only use real original prices or competitor prices\n\n## Technique 2: Charm Pricing\nPrice just below a round number: $29.99 instead of $30.\n- The \"9\" ending is perceived as significantly less than the round number\n- Works especially well for products under $100\n- For premium products ($500+), use round numbers instead — they signal quality\n\n## Technique 3: The Decoy Effect\nAdd a third option that makes your target option look like the best deal.\n- Basic: $29 (limited features)\n- Premium: $49 (all features) ← your target\n- Enterprise: $47 (same as Premium but slightly less value) ← the decoy\n- People now see Premium as the obvious choice\n\n## Technique 4: Bundling\nGroup products together at a discount to increase average order value.\n- Individual prices: $29 + $19 + $15 = $63\n- Bundle price: $39 (save $24)\n- Perception: incredible value. Reality: higher revenue per customer.\n\n## Technique 5: Loss Aversion\nPeople fear losing more than they enjoy gaining. Frame your pricing around what they'll LOSE by not buying.\n- Instead of: \"Save 30% with our product\"\n- Try: \"Most stores lose $10,000/year from slow checkout — here's how to stop it\"\n\n## Technique 6: Social Proof Pricing\nShow what others are paying happily.\n- \"Join 2,400 stores already optimizing their conversions for $49/month\"\n- Normalizes the purchase decision", order: 3 },
      { type: "LINK", title: "OptinMonster Cart Recovery", description: "Exit-intent popups and cart recovery tools for e-commerce stores.", linkUrl: "https://optinmonster.com", order: 4 },
    ],
    "shopify-speed-surge": [
      { type: "TEXT", title: "Shopify Speed Optimization Checklist", description: "Complete 30-point checklist to maximize your Shopify store's performance.", textContent: "# Shopify Speed Optimization Checklist\n\n## Images (Points 1-8)\n1. All product images compressed (WebP format preferred)\n2. Lazy loading enabled on all images\n3. Image dimensions match display size\n4. Alt text on every image (also helps SEO)\n5. Hero banner optimized separately\n6. Thumbnail images are small files\n7. No animated GIFs on main pages\n8. CDN serving all images (Shopify does this automatically)\n\n## Code & Apps (Points 9-18)\n9. Audit all installed apps — remove unused ones\n10. Disable any app that adds scripts you don't need\n11. Minify CSS and JavaScript\n12. Remove unused CSS selectors\n13. Defer non-critical JavaScript\n14. Limit third-party tracking scripts to essentials\n15. Use async loading for chat widgets\n16. Check for render-blocking resources\n17. Optimize Liquid template code\n18. Reduce DOM elements on homepage\n\n## Theme & UX (Points 19-26)\n19. Enable browser caching\n20. Use Shopify's built-in speed features\n21. Optimize mobile navigation\n22. Reduce homepage product count (show top 8-12)\n23. Use collection pages instead of infinite scroll\n24. Optimize checkout flow (fewer steps)\n25. Enable prefetching for internal links\n26. Test with Google PageSpeed Insights\n\n## Advanced (Points 27-30)\n27. Enable HTTP/2 (Shopify handles this)\n28. Set up Core Web Vitals monitoring\n29. A/B test page layouts for speed vs. conversion\n30. Schedule monthly speed audits", order: 0 },
      { type: "VIDEO", title: "Shopify Theme Speed Optimization", description: "Video walkthrough of optimizing a Shopify theme for maximum speed.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1 },
      { type: "LINK", title: "Google PageSpeed Insights", description: "Test your store's speed and get actionable recommendations.", linkUrl: "https://pagespeed.web.dev/", order: 2 },
      { type: "TEXT", title: "App Audit Guide", description: "How to evaluate and remove Shopify apps that slow your store down.", textContent: "# Shopify App Audit\n\n## Step 1: List All Apps\nGo to Settings → Apps → Installed apps. Write down every app.\n\n## Step 2: Categorize\n- **Essential**: Payment, shipping, inventory (keep)\n- **Marketing**: Email, SEO, social (review each)\n- **Analytics**: Only keep GA4 + one heatmap tool\n- **Support**: Chat widget (keep one, disable others)\n- **Other**: If you can't remember why it's installed, uninstall it\n\n## Step 3: Check Script Impact\nUse Chrome DevTools > Network tab. Reload your homepage and note which apps add external scripts.\n\n## Step 4: Uninstall & Test\nRemove one app at a time. After each removal, run PageSpeed Insights to measure impact.\n\n## Typical Savings\n- Removing 3 unused apps: 200-500ms improvement\n- Disabling unnecessary chat widget: 100-300ms\n- Removing duplicate analytics: 150ms", order: 3 },
    ],
  };

  for (const [slug, items] of Object.entries(contentBySlug)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) { console.warn(`⚠️  Product not found for slug: ${slug}`); continue; }

    // Delete existing content items for idempotent re-seed
    await prisma.contentItem.deleteMany({ where: { productId: product.id } });

    for (const item of items) {
      await prisma.contentItem.create({
        data: {
          productId: product.id,
          type: item.type,
          title: item.title,
          description: item.description,
          textContent: item.textContent,
          linkUrl: item.linkUrl,
          videoUrl: item.videoUrl,
          fileUrl: item.fileUrl,
          fileName: item.fileName,
          fileSize: item.fileSize,
          order: item.order,
        },
      });
    }
    console.log(`✅ Content items seeded for: ${product.name} (${items.length} items)`);
  }

  // --- Seed NewsItems ---
  console.log("📰 Seeding news items...");

  const firstProductForNews = await prisma.product.findUnique({ where: { slug: "email-newsletter-starter-pack" } });

  const newsItems = [
    {
      title: "Welcome to CodeCraft",
      body: "Welcome aboard! You now have access to premium digital marketing resources. Explore your products, download templates, and join our Discord community for support and networking. We're constantly adding new content — check back weekly for fresh resources.",
      productId: null as string | null,
      published: true,
    },
    {
      title: "New Email Templates Added",
      body: "We've added 4 new seasonal email templates to the Newsletter Starter Pack: Valentine's Day promo, Spring refresh, Summer sale, and Year-end recap. These are fully customizable in Canva and ready to deploy immediately.",
      productId: firstProductForNews?.id || null,
      published: true,
    },
  ];

  // Clear existing news for idempotent re-seed
  await prisma.newsItem.deleteMany({});

  for (const item of newsItems) {
    await prisma.newsItem.create({ data: item });
  }
  console.log(`✅ News items seeded (${newsItems.length} items)`);

  // Create test customer with access to first product
  const customerPassword = await bcrypt.hash(customerPwd, 10);

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
      name: "Test Customer",
    },
  });

  console.log("✅ Test customer created:", customer.email);

  // Grant access to first product
  const firstProduct = await prisma.product.findFirst({
    where: { slug: "email-newsletter-starter-pack" },
  });

  if (firstProduct) {
    await prisma.productAccess.upsert({
      where: {
        userId_productId: {
          userId: customer.id,
          productId: firstProduct.id,
        },
      },
      update: {},
      create: {
        userId: customer.id,
        productId: firstProduct.id,
        status: "ACTIVE",
        accessType: "LIFETIME",
      },
    });
    console.log("✅ Product access granted to test customer");
  }

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
