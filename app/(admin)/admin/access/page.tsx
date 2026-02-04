import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { AccessManagement } from "@/components/admin/access-management"
import { AccessTable } from "@/components/admin/access-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getAccessData() {
  const [users, products, accessRecords] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.productAccess.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
  ])

  return { users, products, accessRecords }
}

async function AccessContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/access")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getAccessData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Access Management</h1>
        <p className="text-muted-foreground mt-2">
          Grant, revoke, and monitor product access for all users
        </p>
      </div>

      {/* Summary cards + Grant/Export buttons */}
      <AccessManagement
        users={data.users}
        products={data.products}
        accessRecords={data.accessRecords}
      />

      {/* Full access table */}
      <AccessTable accessRecords={data.accessRecords} />
    </div>
  )
}

function AccessSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function AccessPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<AccessSkeleton />}>
        <AccessContent />
      </Suspense>
    </div>
  )
}
