import { prisma } from "@/lib/db/prisma"
import { TokenType } from "@prisma/client"

const OTP_LENGTH = 6
const OTP_EXPIRY_MINUTES = 10

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
