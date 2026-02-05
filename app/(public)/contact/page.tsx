import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactForm } from "@/components/forms/contact-form"
import { Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { CONTACT_INFO, COMPANY_INFO } from "@/lib/constants"

export const metadata = {
  title: "Contact Us | TechSci CodeCraft",
  description: "Get in touch with our team. We're here to help with any questions about our products or services.",
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/10 to-background" />
          </div>

          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Contact Us</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="block bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Let&apos;s Start a
              </span>
              <span className="block bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                Conversation
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Have questions? We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                  <Mail className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>

                <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                  <MapPin className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Our Location</h3>
                  <p className="text-sm text-muted-foreground">
                    {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state}<br />
                    {COMPANY_INFO.address.country}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                  <Clock className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM PST
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
