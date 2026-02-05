import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth/config"
import { UserRole } from "@prisma/client"

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/products",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/api/auth",
]

// Admin-only routes
const adminRoutes = ["/admin"]

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === pathname) return true
    if (route.endsWith("*")) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname.startsWith(route)
  })
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip proxy for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files (images, fonts, etc.)
  ) {
    return NextResponse.next()
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Get the current session
  const session = await auth()

  // Check if route requires authentication
  if (isProtectedRoute(pathname)) {
    if (!session?.user) {
      // Redirect to login with callback URL
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin users hitting /dashboard get redirected to /admin
    if (session.user.role === UserRole.ADMIN && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  // Check if route requires admin role
  if (isAdminRoute(pathname)) {
    if (!session?.user) {
      // Not authenticated - redirect to login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.user.role !== UserRole.ADMIN) {
      // Authenticated but not admin - redirect to dashboard with error
      const dashboardUrl = new URL("/dashboard", request.url)
      dashboardUrl.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (session?.user && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
