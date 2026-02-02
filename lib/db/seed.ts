import prisma from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("SecurePassword123!", 10);

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
      pricingType: "ONE_TIME",
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
      pricingType: "ONE_TIME",
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
      pricingType: "ONE_TIME",
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
      pricingType: "SUBSCRIPTION",
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
      pricingType: "SUBSCRIPTION",
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
      pricingType: "ONE_TIME",
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
      featured: false,
      popular: false,
    },
  ];

  console.log("📦 Creating products...");

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
    console.log(`✅ Product created: ${product.name}`);
  }

  // Create test customer with access to first product
  const customerPassword = await bcrypt.hash("TestPassword123!", 10);

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
