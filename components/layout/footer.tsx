import Link from "next/link"
import { Code2, Twitter, Linkedin, Github, Youtube } from "lucide-react"
import { NewsletterForm } from "@/components/forms/newsletter-form"
import { NAVIGATION, SITE_CONFIG, SOCIAL_LINKS, COMPANY_INFO } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand section - spans 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
                <Code2 className="h-8 w-8 text-primary relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight leading-none">
                  {SITE_CONFIG.shortName}
                </span>
                <span className="text-xs text-muted-foreground font-medium leading-none mt-0.5">
                  by TechSci
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              <SocialLink href={SOCIAL_LINKS.twitter} icon={Twitter} label="Twitter" />
              <SocialLink href={SOCIAL_LINKS.linkedin} icon={Linkedin} label="LinkedIn" />
              <SocialLink href={SOCIAL_LINKS.github} icon={Github} label="GitHub" />
              <SocialLink href={SOCIAL_LINKS.youtube} icon={Youtube} label="YouTube" />
            </div>
          </div>

          {/* Navigation sections - spans 5 columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Products */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-tight">Products</h3>
              <ul className="space-y-3">
                {NAVIGATION.footer.products.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-tight">Company</h3>
              <ul className="space-y-3">
                {NAVIGATION.footer.company.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-tight">Legal</h3>
              <ul className="space-y-3">
                {NAVIGATION.footer.legal.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter section - spans 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold tracking-tight">Stay Updated</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Subscribe to our newsletter for the latest updates and exclusive content.
              </p>
            </div>

            <NewsletterForm variant="compact" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {currentYear} {COMPANY_INFO.legalName}. All rights reserved.
            </p>

            {/* Additional info */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                Built with
                <span className="inline-block animate-pulse text-primary">♥</span>
                in {COMPANY_INFO.address.city}
              </span>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/sitemap.xml"
                className="hover:text-foreground transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Social link component with hover effects
function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      aria-label={label}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 group-hover:opacity-100 transition-all duration-300" />

      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200 relative z-10" />
    </a>
  )
}

// Footer link component with consistent styling
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
    >
      <span className="relative">
        {children}
        {/* Animated underline */}
        <span className="absolute left-0 bottom-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-300" />
      </span>
    </Link>
  )
}
