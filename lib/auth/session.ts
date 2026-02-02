import { auth } from "./auth"
import { UserRole } from "@prisma/client"

/**
 * Get the current session
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user from session
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return !!session?.user
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === UserRole.ADMIN
}

/**
 * Require authentication (throw error if not authenticated)
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user
}

/**
 * Require admin role (throw error if not admin)
 */
export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden: Admin access required")
  }
  return session.user
}
