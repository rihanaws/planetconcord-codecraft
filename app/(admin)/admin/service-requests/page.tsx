import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { ServiceRequestTable } from "@/components/admin/service-request-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getServiceRequestData() {
  const [serviceRequests, products] = await Promise.all([
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return { serviceRequests, products }
}

async function ServiceRequestsContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/service-requests")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const data = await getServiceRequestData()

  // Serialize dates for client component
  const serializedRequests = data.serviceRequests.map((r: (typeof data.serviceRequests)[0]) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Service Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer store optimization requests
        </p>
      </div>

      <ServiceRequestTable serviceRequests={serializedRequests} products={data.products} />
    </div>
  )
}

function ServiceRequestsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function ServiceRequestsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<ServiceRequestsSkeleton />}>
        <ServiceRequestsContent />
      </Suspense>
    </div>
  )
}
