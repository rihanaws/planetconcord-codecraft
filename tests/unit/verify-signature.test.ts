/**
 * Unit tests for Whop webhook signature verification
 * Covers: valid signatures, invalid signatures, tampered payloads, edge cases
 */
import { describe, it, expect } from "vitest"
import crypto from "crypto"
import { verifyWhopSignature } from "@/lib/whop/verify-signature"

function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

describe("verifyWhopSignature", () => {
  const secret = "test_webhook_secret_key"
  const payload = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_123" } })

  it("should return true for a valid signature", () => {
    const signature = generateSignature(payload, secret)
    expect(verifyWhopSignature(payload, signature, secret)).toBe(true)
  })

  it("should return false for an invalid signature", () => {
    expect(verifyWhopSignature(payload, "invalid_signature_hex_value_here", secret)).toBe(false)
  })

  it("should return false when payload is tampered", () => {
    const signature = generateSignature(payload, secret)
    const tamperedPayload = JSON.stringify({ type: "payment.succeeded", data: { id: "pay_999" } })
    expect(verifyWhopSignature(tamperedPayload, signature, secret)).toBe(false)
  })

  it("should return false when secret is wrong", () => {
    const signature = generateSignature(payload, secret)
    expect(verifyWhopSignature(payload, signature, "wrong_secret")).toBe(false)
  })

  it("should return false for empty signature", () => {
    expect(verifyWhopSignature(payload, "", secret)).toBe(false)
  })

  it("should return false for empty payload with non-empty signature", () => {
    const signature = generateSignature("", secret)
    expect(verifyWhopSignature("some_payload", signature, secret)).toBe(false)
  })

  it("should handle empty payload correctly when signature matches", () => {
    const signature = generateSignature("", secret)
    expect(verifyWhopSignature("", signature, secret)).toBe(true)
  })

  it("should be consistent across multiple calls", () => {
    const signature = generateSignature(payload, secret)
    expect(verifyWhopSignature(payload, signature, secret)).toBe(true)
    expect(verifyWhopSignature(payload, signature, secret)).toBe(true)
    expect(verifyWhopSignature(payload, signature, secret)).toBe(true)
  })
})
