import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductHero } from "@/components/products/product-hero"
import { ProductFeatures } from "@/components/products/product-features"
import { ProductFAQ } from "@/components/products/product-faq"
import { getAllProducts, getProductBySlug } from "@/lib/products"
import { getProductImageUrl } from "@/lib/product-images"
import { SITE_CONFIG } from "@/lib/constants"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Parse JSON fields
  const features = product.features
    ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features)
    : []

  const faqs = product.faq
    ? (typeof product.faq === 'string' ? JSON.parse(product.faq) : product.faq)
    : []

  const requirements = product.requirements
    ? (typeof product.requirements === 'string' ? JSON.parse(product.requirements) : product.requirements)
    : []

  const productImageUrl = getProductImageUrl(slug)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description || "",
    image: productImageUrl ? `${SITE_CONFIG.url}${productImageUrl}` : `${SITE_CONFIG.url}/images/CODE_CRAFT_LOGO.png`,
    url: `${SITE_CONFIG.url}/products/${slug}`,
    brand: { "@type": "Organization", name: "TechSci CodeCraft" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <Header />
      {/* JSON-LD structured data — values are DB-sourced, serialised via JSON.stringify (no raw user input) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        {/* Product Hero */}
        <ProductHero product={product} />

        {/* Full Description */}
        {product.description && (
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                  <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    About This Product
                  </span>
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        {features.length > 0 && <ProductFeatures features={features} />}

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="relative py-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                  <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Requirements
                  </span>
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  {requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && <ProductFAQ faqs={faqs} />}

        {/* Final CTA */}
        <section className="relative py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="relative p-12 md:p-16 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10 text-center overflow-hidden">
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-primary/10 via-transparent to-transparent rounded-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-accent/10 via-transparent to-transparent rounded-3xl" />

              <div className="relative space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  <span className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Ready to Get Started?
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of satisfied customers and transform your business today
                </p>
                <a
                  href={product.whopCheckoutUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                >
                  <button className="group h-14 px-10 rounded-md bg-primary text-primary-foreground font-semibold text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Buy Now - {product.name}</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// Revalidate product pages every 10 minutes
export const revalidate = 600

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

// Generate metadata for SEO

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Product Not Found" }
  }

  const description = product.shortDesc || product.description || ""
  const productImage = getProductImageUrl(slug)
  const ogImage = productImage
    ? { url: productImage, width: 1200, height: 630, alt: product.name }
    : { url: "/images/CODE_CRAFT_LOGO.png", width: 800, height: 800, alt: "TechSci CodeCraft" }
  const canonicalUrl = `${SITE_CONFIG.url}/products/${slug}`

  return {
    title: `${product.name} | TechSci CodeCraft`,
    description,
    keywords: [product.name, product.category, "digital product", "TechSci CodeCraft"],
    openGraph: {
      title: product.name,
      description,
      url: canonicalUrl,
      type: "website",
      images: [ogImage],
      siteName: "TechSci CodeCraft",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [ogImage.url],
    },
  }
}
