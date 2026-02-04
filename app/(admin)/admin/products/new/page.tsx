import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { UserRole } from "@prisma/client"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/products/new")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create New Product</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to add a new product to your catalog
          </p>
        </div>

        <ProductForm mode="create" />
      </div>
    </div>
  )
}
