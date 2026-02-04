import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { UserTable } from "@/components/admin/user-table"
import { Skeleton } from "@/components/ui/skeleton"

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          purchases: true,
          productAccess: true,
        },
      },
    },
  })
}

async function UsersContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/users")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard?error=unauthorized")
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users
        </p>
      </div>

      <UserTable users={users} />
    </div>
  )
}

function UsersSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<UsersSkeleton />}>
        <UsersContent />
      </Suspense>
    </div>
  )
}
