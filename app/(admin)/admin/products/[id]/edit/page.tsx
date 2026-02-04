import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/products")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const { id } = await params

  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    redirect("/admin/products")
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-2">
            Update the details for <span className="font-semibold text-foreground">{product.name}</span>
          </p>
        </div>

        <ProductForm
          mode="edit"
          defaultValues={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            shortDesc: product.shortDesc || undefined,
            price: product.price,
            pricingType: product.pricingType,
            category: product.category,
            whopProductId: product.whopProductId || undefined,
            whopCheckoutUrl: product.whopCheckoutUrl || undefined,
            featured: product.featured,
            popular: product.popular,
            deliverables: (product.deliverables as string[]) || [],
            features: (product.features as string[]) || [],
            requirements: (product.requirements as string[]) || [],
            faq: (product.faq as { question: string; answer: string }[]) || [],
          }}
        />
      </div>
    </div>
  )
}
