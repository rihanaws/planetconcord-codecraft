import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield } from "lucide-react"


export const metadata = {
  title: "Privacy Policy | TechSci CodeCraft",
  description: "Privacy Policy for TechSci CodeCraft Agency - How we collect, use, and protect your data.",
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
              <p className="text-muted-foreground">Last updated: February 2, 2026</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Name and email address when you create an account</li>
                  <li>• Payment information processed through our secure payment provider</li>
                  <li>• Communications you send to our support team</li>
                  <li>• Usage data and analytics about how you interact with our services</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide, maintain, and improve our services</li>
                  <li>• Process transactions and send related information</li>
                  <li>• Send technical notices, updates, and support messages</li>
                  <li>• Respond to your comments and questions</li>
                  <li>• Monitor and analyze trends and usage</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with legal obligations, to protect our rights, or with service providers who assist in our operations (under strict confidentiality agreements).
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">6. Your Rights (GDPR)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you are a European resident, you have the right to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access your personal data</li>
                  <li>• Request correction of inaccurate data</li>
                  <li>• Request deletion of your data</li>
                  <li>• Object to processing of your data</li>
                  <li>• Request data portability</li>
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50">
                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this Privacy Policy, please contact us at support@techsci.xyz.
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
