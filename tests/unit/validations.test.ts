/**
 * Unit tests for Zod validation schemas
 * Covers: all webhook schemas, user input schemas, product schemas
 */
import { describe, it, expect } from "vitest"
import {
  PaymentSucceededSchema,
  MembershipValidSchema,
  MembershipInvalidSchema,
  PaymentRefundedSchema,
  WhopWebhookSchema,
  UserRegisterSchema,
  UserLoginSchema,
  EmailVerificationSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
  ContactFormSchema,
  NewsletterSchema,
} from "@/lib/validations"

// ===========================
// WEBHOOK SCHEMAS
// ===========================

describe("PaymentSucceededSchema", () => {
  const validPayload = {
    id: "evt_123",
    type: "payment.succeeded" as const,
    data: {
      id: "pay_abc",
      amount: 149,
      currency: "USD",
      customer_email: "test@example.com",
      product_id: "prod_xyz",
    },
  }

  it("should parse a valid payment.succeeded event", () => {
    const result = PaymentSucceededSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it("should include optional customer_name", () => {
    const result = PaymentSucceededSchema.safeParse({
      ...validPayload,
      data: { ...validPayload.data, customer_name: "John Doe" },
    })
    expect(result.success).toBe(true)
  })

  it("should include optional metadata with productSlug", () => {
    const result = PaymentSucceededSchema.safeParse({
      ...validPayload,
      data: { ...validPayload.data, metadata: { productSlug: "email-starter" } },
    })
    expect(result.success).toBe(true)
  })

  it("should fail for invalid email", () => {
    const result = PaymentSucceededSchema.safeParse({
      ...validPayload,
      data: { ...validPayload.data, customer_email: "not-an-email" },
    })
    expect(result.success).toBe(false)
  })

  it("should fail when missing required amount", () => {
    const { amount, ...rest } = validPayload.data
    void amount // intentionally omitted from test payload
    const result = PaymentSucceededSchema.safeParse({
      ...validPayload,
      data: rest,
    })
    expect(result.success).toBe(false)
  })
})

describe("MembershipValidSchema", () => {
  it("should parse a valid membership.went_valid event", () => {
    const result = MembershipValidSchema.safeParse({
      id: "evt_456",
      type: "membership.went_valid",
      data: { id: "mem_abc", user_id: "usr_123", product_id: "prod_xyz" },
    })
    expect(result.success).toBe(true)
  })

  it("should accept optional valid_until", () => {
    const result = MembershipValidSchema.safeParse({
      id: "evt_456",
      type: "membership.went_valid",
      data: {
        id: "mem_abc",
        user_id: "usr_123",
        product_id: "prod_xyz",
        valid_until: "2026-03-01T00:00:00Z",
      },
    })
    expect(result.success).toBe(true)
  })

  it("should fail for wrong type literal", () => {
    const result = MembershipValidSchema.safeParse({
      id: "evt_456",
      type: "membership.went_invalid",
      data: { id: "mem_abc", user_id: "usr_123", product_id: "prod_xyz" },
    })
    expect(result.success).toBe(false)
  })
})

describe("MembershipInvalidSchema", () => {
  it("should parse a valid membership.went_invalid event", () => {
    const result = MembershipInvalidSchema.safeParse({
      id: "evt_789",
      type: "membership.went_invalid",
      data: { id: "mem_def", user_id: "usr_456", product_id: "prod_abc" },
    })
    expect(result.success).toBe(true)
  })
})

describe("PaymentRefundedSchema", () => {
  it("should parse a valid payment.refunded event", () => {
    const result = PaymentRefundedSchema.safeParse({
      id: "evt_refund_1",
      type: "payment.refunded",
      data: { id: "ref_abc", original_payment_id: "pay_original_123" },
    })
    expect(result.success).toBe(true)
  })

  it("should fail when missing original_payment_id", () => {
    const result = PaymentRefundedSchema.safeParse({
      id: "evt_refund_1",
      type: "payment.refunded",
      data: { id: "ref_abc" },
    })
    expect(result.success).toBe(false)
  })
})

describe("WhopWebhookSchema (discriminated union)", () => {
  it("should route payment.succeeded correctly", () => {
    const result = WhopWebhookSchema.safeParse({
      id: "evt_1",
      type: "payment.succeeded",
      data: {
        id: "pay_1",
        amount: 100,
        currency: "USD",
        customer_email: "a@b.com",
        product_id: "p1",
      },
    })
    expect(result.success).toBe(true)
  })

  it("should route membership.went_valid correctly", () => {
    const result = WhopWebhookSchema.safeParse({
      id: "evt_2",
      type: "membership.went_valid",
      data: { id: "m1", user_id: "u1", product_id: "p1" },
    })
    expect(result.success).toBe(true)
  })

  it("should fail for unknown event type", () => {
    const result = WhopWebhookSchema.safeParse({
      id: "evt_3",
      type: "unknown.event",
      data: {},
    })
    expect(result.success).toBe(false)
  })
})

// ===========================
// USER INPUT SCHEMAS
// ===========================

describe("UserRegisterSchema", () => {
  const validUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "StrongPass1!",
  }

  it("should parse valid registration input", () => {
    expect(UserRegisterSchema.safeParse(validUser).success).toBe(true)
  })

  it("should fail for name shorter than 2 chars", () => {
    expect(UserRegisterSchema.safeParse({ ...validUser, name: "J" }).success).toBe(false)
  })

  it("should fail for invalid email", () => {
    expect(UserRegisterSchema.safeParse({ ...validUser, email: "bad" }).success).toBe(false)
  })

  it("should fail for weak password (no special char)", () => {
    expect(UserRegisterSchema.safeParse({ ...validUser, password: "NoSpecial1" }).success).toBe(false)
  })
})

describe("UserLoginSchema", () => {
  it("should parse valid login input", () => {
    expect(UserLoginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true)
  })

  it("should fail for empty password", () => {
    expect(UserLoginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false)
  })
})

describe("EmailVerificationSchema", () => {
  it("should parse valid OTP input", () => {
    expect(EmailVerificationSchema.safeParse({ email: "a@b.com", otp: "123456" }).success).toBe(true)
  })

  it("should fail for OTP not exactly 6 chars", () => {
    expect(EmailVerificationSchema.safeParse({ email: "a@b.com", otp: "12345" }).success).toBe(false)
    expect(EmailVerificationSchema.safeParse({ email: "a@b.com", otp: "1234567" }).success).toBe(false)
  })
})

describe("PasswordResetRequestSchema", () => {
  it("should parse valid email", () => {
    expect(PasswordResetRequestSchema.safeParse({ email: "reset@test.com" }).success).toBe(true)
  })

  it("should fail for invalid email", () => {
    expect(PasswordResetRequestSchema.safeParse({ email: "nope" }).success).toBe(false)
  })
})

describe("PasswordResetSchema", () => {
  it("should parse valid reset input", () => {
    const result = PasswordResetSchema.safeParse({
      email: "a@b.com",
      otp: "654321",
      password: "NewPass123!",
    })
    expect(result.success).toBe(true)
  })

  it("should fail for weak new password", () => {
    const result = PasswordResetSchema.safeParse({
      email: "a@b.com",
      otp: "654321",
      password: "weak",
    })
    expect(result.success).toBe(false)
  })
})

describe("ContactFormSchema", () => {
  const valid = { name: "Jane", email: "j@x.com", subject: "Hello there", message: "This is a test message" }

  it("should parse valid contact input", () => {
    expect(ContactFormSchema.safeParse(valid).success).toBe(true)
  })

  it("should fail for short subject", () => {
    expect(ContactFormSchema.safeParse({ ...valid, subject: "Hi" }).success).toBe(false)
  })

  it("should fail for short message", () => {
    expect(ContactFormSchema.safeParse({ ...valid, message: "Short" }).success).toBe(false)
  })
})

describe("NewsletterSchema", () => {
  it("should parse valid email", () => {
    expect(NewsletterSchema.safeParse({ email: "sub@news.com" }).success).toBe(true)
  })

  it("should fail for invalid email", () => {
    expect(NewsletterSchema.safeParse({ email: "bad-email" }).success).toBe(false)
  })
})
