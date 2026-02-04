/**
 * Unit tests for auth utilities
 * Covers: password hashing, comparison, strength validation
 */
import { describe, it, expect, vi } from "vitest"

// Mock prisma before any auth/utils import — prevents DATABASE_URL parse at module load
vi.mock("@/lib/db/prisma", () => ({
  prisma: {},
}))

// Mock NextAuth config (auth/utils imports it)
vi.mock("@/lib/auth/config", () => ({
  auth: vi.fn(),
}))

import { hashPassword, comparePasswords, validatePasswordStrength } from "@/lib/auth/utils"

describe("hashPassword", () => {
  it("should return a string different from the input", async () => {
    const password = "TestPassword123!"
    const hashed = await hashPassword(password)
    expect(hashed).not.toBe(password)
    expect(typeof hashed).toBe("string")
    expect(hashed.length).toBeGreaterThan(0)
  })

  it("should produce different hashes for the same input", async () => {
    const password = "TestPassword123!"
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)
    expect(hash1).not.toBe(hash2)
  })
})

describe("comparePasswords", () => {
  it("should return true for matching password and hash", async () => {
    const password = "TestPassword123!"
    const hashed = await hashPassword(password)
    const result = await comparePasswords(password, hashed)
    expect(result).toBe(true)
  })

  it("should return false for non-matching password", async () => {
    const hashed = await hashPassword("TestPassword123!")
    const result = await comparePasswords("WrongPassword1!", hashed)
    expect(result).toBe(false)
  })

  it("should return false for empty password", async () => {
    const hashed = await hashPassword("TestPassword123!")
    const result = await comparePasswords("", hashed)
    expect(result).toBe(false)
  })
})

describe("validatePasswordStrength", () => {
  it("should pass for a strong password", () => {
    const result = validatePasswordStrength("SecurePass123!")
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it("should fail for password shorter than 8 characters", () => {
    const result = validatePasswordStrength("Ab1!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Password must be at least 8 characters long")
  })

  it("should fail for password without uppercase", () => {
    const result = validatePasswordStrength("lowercase123!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Password must contain at least one uppercase letter")
  })

  it("should fail for password without lowercase", () => {
    const result = validatePasswordStrength("UPPERCASE123!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Password must contain at least one lowercase letter")
  })

  it("should fail for password without a number", () => {
    const result = validatePasswordStrength("NoNumbers!")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Password must contain at least one number")
  })

  it("should fail for password without a special character", () => {
    const result = validatePasswordStrength("NoSpecial123")
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain("Password must contain at least one special character")
  })

  it("should accumulate multiple errors", () => {
    const result = validatePasswordStrength("ab")
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})
