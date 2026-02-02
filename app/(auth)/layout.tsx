import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - TechSci CodeCraft",
  description: "Sign in or create an account to access TechSci CodeCraft",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
