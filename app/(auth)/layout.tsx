import { Metadata } from "next"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Authentication",
  description: `Sign in or create an account to access ${BRAND.businessName}`,
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
