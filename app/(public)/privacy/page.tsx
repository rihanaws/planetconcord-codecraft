import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield } from "lucide-react"
import { PRIVACY_SECTIONS, LAST_UPDATED, POLICY_CONTACT_EMAIL } from "@/lib/legal/policies"

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Planet-Concord — how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy | Planet-Concord",
    description: "Privacy Policy for Planet-Concord — how we collect, use, and protect your information.",
    url: "https://codecraft.techsci.xyz/privacy",
    siteName: "Planet-Concord",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "Planet-Concord" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/CODE_CRAFT_LOGO.png"],
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5 mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Privacy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-muted-foreground text-sm">Planet-Concord · Last Updated: {LAST_UPDATED}</p>
            </div>

            <div className="space-y-6">
              {PRIVACY_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  aria-labelledby={section.id}
                  className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50"
                >
                  <h2 id={section.id} className="text-2xl font-bold mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                        {section.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}

              <section
                aria-labelledby="contact"
                className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50"
              >
                <h2 id="contact" className="text-2xl font-bold mb-4">
                  Contact
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For questions, support, refunds, or privacy requests, contact Planet-Concord through Whop
                  support chat or at{" "}
                  <a
                    href={`mailto:${POLICY_CONTACT_EMAIL}`}
                    aria-label={`Email ${POLICY_CONTACT_EMAIL}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {POLICY_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
