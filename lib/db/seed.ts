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
