import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductsContent } from "./products-content"
import { Package } from "lucide-react"
import { getAllProducts } from "@/lib/products"

export const metadata = {
  title: "Products | TechSci CodeCraft",
  description: "Browse our collection of premium digital products for marketing, analytics, and development.",
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Page header */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/10 to-background" />
          </div>

          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Our Products</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="block bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Premium Digital
                </span>
                <span className="block bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                  Products
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our collection of professional tools and resources designed to accelerate your business growth
              </p>
            </div>
          </div>
        </section>

        {/* Products section */}
        <ProductsContent initialProducts={products} />
      </main>
      <Footer />
    </>
  )
}
