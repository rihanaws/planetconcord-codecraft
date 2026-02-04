import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { TokenType, UserRole } from "@prisma/client"
import { auth } from "./config"

const SALT_ROUNDS = 10 // As per plan (line 232)
const OTP_EXPIRY_MINUTES = 10

// ===========================
// PASSWORD UTILITIES
// ===========================

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ===========================
// OTP GENERATION (6-digit codes)
// ===========================

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Create and store an OTP token in the database
 */
export async function createOTPToken(
  identifier: string,
  type: TokenType
): Promise<string> {
  // Delete any existing tokens for this identifier and type
  await prisma.verificationToken.deleteMany({
    where: {
      identifier,
      type,
    },
  })

  // Generate new OTP
  const token = generateOTP()

  // Calculate expiry time (10 minutes from now)
  const expires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  // Store in database
  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      type,
      expires,
    },
  })

  return token
}

/**
 * Verify an OTP token
 */
export async function verifyOTPToken(
  identifier: string,
  token: string,
  type: TokenType
): Promise<{ success: boolean; error?: string }> {
  // Find the token
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      token,
      type,
    },
  })

  if (!verificationToken) {
    return {
      success: false,
      error: "Invalid verification code",
    }
  }

  // Check if expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    return {
      success: false,
      error: "Verification code has expired. Please request a new one.",
    }
  }

  // Delete used token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  })

  return { success: true }
}

/**
 * Clean up expired tokens (run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  })

  return result.count
}

// ===========================
// EMAIL VERIFICATION HELPERS
// ===========================

/**
 * Mark user's email as verified
 */
export async function markEmailVerified(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })
}

// ===========================
// SESSION HELPERS
// ===========================

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

// ===========================
// ROLE-BASED ACCESS CONTROL UTILITIES
// ===========================

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession()
  return session?.user?.role === role
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const session = await getSession()
  if (!session?.user?.role) return false
  return roles.includes(session.user.role)
}
