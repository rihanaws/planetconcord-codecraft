import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Building2, Target, Award, Users } from "lucide-react"
import { COMPANY_INFO } from "@/lib/constants"

export const metadata = {
  title: "About Us | TechSci CodeCraft",
  description: "Learn about TechSci CodeCraft Agency - our mission, values, and commitment to delivering premium digital products.",
  openGraph: {
    title: "About Us | TechSci CodeCraft",
    description: "Learn about TechSci CodeCraft Agency - our mission, values, and commitment to delivering premium digital products.",
    url: "https://codecraft.techsci.xyz/about",
    type: "website",
    images: [{ url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/CODE_CRAFT_LOGO.png"],
  },
}

export default function AboutPage() {
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
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">About Us</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="block bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Empowering Businesses
              </span>
              <span className="block bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                Through Innovation
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {COMPANY_INFO.legalName} is dedicated to creating premium digital products that help businesses grow, scale, and succeed in the digital age.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide businesses with world-class digital tools and resources that drive measurable growth and success.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quality, integrity, and customer success are at the core of everything we create and deliver.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Our Team</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experienced professionals passionate about technology, design, and helping businesses thrive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5 space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Founded in {COMPANY_INFO.foundedYear}, TechSci CodeCraft Agency was born from a simple vision: to bridge the gap between cutting-edge technology and practical business solutions.
                </p>
                <p>
                  We&apos;ve helped over 10,000 businesses transform their digital presence through our carefully crafted products. From email marketing solutions to advanced analytics tools, each product is designed with one goal in mind - your success.
                </p>
                <p>
                  Based in {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state}, we serve customers worldwide, providing instant access to premium digital products backed by exceptional support.
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
