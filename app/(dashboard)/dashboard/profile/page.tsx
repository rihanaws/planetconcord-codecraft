import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { PasswordChangeForm } from "@/components/dashboard/password-change-form"
import { AvatarUpload } from "@/components/dashboard/avatar-upload"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Key, Link as LinkIcon } from "lucide-react"

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          provider: true,
          providerAccountId: true,
        },
      },
    },
  })

  return user
}

async function ProfileContent() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/profile")
  }

  const user = await getUserProfile(session.user.id)

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your photo and personal details
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Avatar Upload */}
          <AvatarUpload
            currentImage={user.image}
            userName={user.name}
            userId={user.id}
          />

          <Separator className="bg-border/50" />

          {/* Profile Form */}
          <ProfileForm
            defaultValues={{
              name: user.name || "",
              email: user.email || "",
            }}
            userId={user.id}
          />
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-chart-2/10 to-transparent opacity-50" />

        <div className="relative p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <LinkIcon className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Connected Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Manage your OAuth provider connections
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-3">
            {user.accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No OAuth providers connected
              </p>
            ) : (
              user.accounts.map((account: (typeof user.accounts)[0]) => (
                <div
                  key={account.provider}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{account.provider}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {account.providerAccountId}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Connected</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-chart-3/10 to-transparent opacity-50" />

        <div className="relative p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-3/10">
              <Key className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Account Security</h2>
              <p className="text-sm text-muted-foreground">
                Change your password to keep your account secure
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Password Change Form */}
          {user.password ? (
            <PasswordChangeForm userId={user.id} />
          ) : (
            <div className="p-4 rounded-lg bg-muted/50 border border-border/30">
              <p className="text-sm text-muted-foreground">
                You signed up with a social provider. Password management is not available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}
