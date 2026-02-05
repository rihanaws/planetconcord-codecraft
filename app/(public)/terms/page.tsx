import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText } from "lucide-react"
import { COMPANY_INFO } from "@/lib/constants"

export const metadata = {
  title: "Terms of Service | TechSci CodeCraft",
  description: "Terms of Service for TechSci CodeCraft Agency digital products.",
  openGraph: {
    title: "Terms of Service | TechSci CodeCraft",
    description: "Terms of Service for TechSci CodeCraft Agency digital products.",
    url: "https://codecraft.techsci.xyz/terms",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/CODE_CRAFT_LOGO.png"],
  },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5 mb-6">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Legal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-muted-foreground">Last updated: February 2, 2026</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the services provided by {COMPANY_INFO.legalName} (&quot;TechSci CodeCraft,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">2. Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TechSci CodeCraft provides digital products including marketing tools, analytics solutions, and development resources. All products are delivered digitally and access is granted immediately upon successful payment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any service at any time without notice.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">4. Payment and Billing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All payments are processed securely through our payment partner, Whop. Prices are listed in USD and are subject to change without notice.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For subscription-based products, you authorize us to charge your payment method on a recurring basis until you cancel your subscription.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content, features, and functionality are owned by {COMPANY_INFO.legalName} and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works of our products without explicit written permission.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, {COMPANY_INFO.legalName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of {COMPANY_INFO.registeredState}, without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at support@techsci.xyz.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
