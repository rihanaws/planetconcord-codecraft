/**
 * Unit tests for webhook event routing
 * Mocks prisma and email — verifies correct handler dispatch and DB operations
 */
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock prisma transaction
const mockTx = {
  product: { findFirst: vi.fn() },
  user: { findUnique: vi.fn(), create: vi.fn() },
  purchase: { findUnique: vi.fn(), create: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  productAccess: { create: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
}

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $transaction: vi.fn((fn: (tx: typeof mockTx) => Promise<void>) => fn(mockTx)),
  },
}))

vi.mock("@/lib/email/send", () => ({
  sendPurchaseConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendAccessGrantedEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/auth/utils", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed_random_password"),
}))

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}))

import {
  handlePaymentSucceeded,
  handleMembershipValid,
  handleMembershipInvalid,
  handlePaymentRefunded,
  handleWhopWebhook,
} from "@/lib/whop/webhook-handler"

describe("handlePaymentSucceeded", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTx.product.findFirst.mockResolvedValue({
      id: "prod_1",
      name: "Test Product",
      slug: "test-product",
      pricingType: "ONE_TIME",
    })
    mockTx.user.findUnique.mockResolvedValue({
      id: "usr_1",
      email: "customer@test.com",
      name: "Test User",
    })
    mockTx.purchase.findUnique.mockResolvedValue(null) // no duplicate
  })

  it("should create purchase and grant access for existing user", async () => {
    await handlePaymentSucceeded({
      type: "payment.succeeded",
      data: {
        id: "pay_001",
        amount: 149,
        currency: "USD",
        customer_email: "customer@test.com",
        product_id: "whop_prod_1",
      },
    })

    expect(mockTx.purchase.create).toHaveBeenCalledTimes(1)
    expect(mockTx.purchase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "usr_1",
          productId: "prod_1",
          whopPaymentId: "pay_001",
          amount: 149,
        }),
      })
    )
    expect(mockTx.productAccess.create).toHaveBeenCalledTimes(1)
    expect(mockTx.productAccess.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "usr_1",
          productId: "prod_1",
          status: "ACTIVE",
          accessType: "LIFETIME",
        }),
      })
    )
  })

  it("should create a new user when none exists", async () => {
    mockTx.user.findUnique.mockResolvedValue(null)
    mockTx.user.create.mockResolvedValue({
      id: "usr_new",
      email: "new@test.com",
      name: "new",
    })

    await handlePaymentSucceeded({
      type: "payment.succeeded",
      data: {
        id: "pay_002",
        amount: 199,
        currency: "USD",
        customer_email: "new@test.com",
        product_id: "whop_prod_1",
      },
    })

    expect(mockTx.user.create).toHaveBeenCalledTimes(1)
    expect(mockTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "new@test.com",
          role: "CUSTOMER",
        }),
      })
    )
  })

  it("should skip duplicate payments silently", async () => {
    mockTx.purchase.findUnique.mockResolvedValue({ id: "existing_purchase" })

    await handlePaymentSucceeded({
      type: "payment.succeeded",
      data: {
        id: "pay_duplicate",
        amount: 149,
        currency: "USD",
        customer_email: "customer@test.com",
        product_id: "whop_prod_1",
      },
    })

    expect(mockTx.purchase.create).not.toHaveBeenCalled()
    expect(mockTx.productAccess.create).not.toHaveBeenCalled()
  })

  it("should set expiresAt for subscription products", async () => {
    mockTx.product.findFirst.mockResolvedValue({
      id: "prod_sub",
      name: "Sub Product",
      slug: "sub-product",
      pricingType: "SUBSCRIPTION",
    })

    await handlePaymentSucceeded({
      type: "payment.succeeded",
      data: {
        id: "pay_sub_1",
        amount: 29.99,
        currency: "USD",
        customer_email: "customer@test.com",
        product_id: "whop_sub_1",
      },
    })

    expect(mockTx.productAccess.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accessType: "SUBSCRIPTION",
          expiresAt: expect.any(Date),
        }),
      })
    )
  })

  it("should throw when product is not found", async () => {
    mockTx.product.findFirst.mockResolvedValue(null)

    await expect(
      handlePaymentSucceeded({
        type: "payment.succeeded",
        data: {
          id: "pay_noprod",
          amount: 100,
          currency: "USD",
          customer_email: "customer@test.com",
          product_id: "nonexistent",
        },
      })
    ).rejects.toThrow("Product not found")
  })
})

describe("handleMembershipValid", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTx.productAccess.findFirst.mockResolvedValue({
      id: "access_1",
      product: { id: "prod_1" },
      user: { id: "usr_1" },
    })
  })

  it("should activate membership and set expiresAt", async () => {
    await handleMembershipValid({
      type: "membership.went_valid",
      data: {
        id: "mem_valid_1",
        user_id: "usr_1",
        product_id: "prod_1",
        valid_until: "2026-06-01T00:00:00Z",
      },
    })

    expect(mockTx.productAccess.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "ACTIVE",
          expiresAt: new Date("2026-06-01T00:00:00Z"),
        }),
      })
    )
  })

  it("should throw when membership access record not found", async () => {
    mockTx.productAccess.findFirst.mockResolvedValue(null)

    await expect(
      handleMembershipValid({
        type: "membership.went_valid",
        data: { id: "mem_missing", user_id: "u1", product_id: "p1" },
      })
    ).rejects.toThrow("ProductAccess not found")
  })
})

describe("handleMembershipInvalid", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTx.productAccess.findFirst.mockResolvedValue({ id: "access_2" })
  })

  it("should expire membership and set revokedAt", async () => {
    await handleMembershipInvalid({
      type: "membership.went_invalid",
      data: { id: "mem_invalid_1", user_id: "usr_1", product_id: "prod_1" },
    })

    expect(mockTx.productAccess.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "EXPIRED",
          revokedAt: expect.any(Date),
        }),
      })
    )
  })

  it("should throw when membership access record not found", async () => {
    mockTx.productAccess.findFirst.mockResolvedValue(null)

    await expect(
      handleMembershipInvalid({
        type: "membership.went_invalid",
        data: { id: "mem_missing2", user_id: "u1", product_id: "p1" },
      })
    ).rejects.toThrow("ProductAccess not found")
  })
})

describe("handlePaymentRefunded", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTx.purchase.findUnique.mockResolvedValue({
      id: "purchase_1",
      userId: "usr_1",
      productId: "prod_1",
    })
  })

  it("should revoke access and update purchase to REFUNDED", async () => {
    await handlePaymentRefunded({
      type: "payment.refunded",
      data: { id: "ref_1", original_payment_id: "pay_original_1" },
    })

    expect(mockTx.purchase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "REFUNDED",
          refundedAt: expect.any(Date),
        }),
      })
    )
    expect(mockTx.productAccess.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "usr_1", productId: "prod_1" },
        data: expect.objectContaining({
          status: "REVOKED",
          revokedReason: "Payment refunded",
        }),
      })
    )
  })

  it("should throw when original purchase not found", async () => {
    mockTx.purchase.findUnique.mockResolvedValue(null)

    await expect(
      handlePaymentRefunded({
        type: "payment.refunded",
        data: { id: "ref_missing", original_payment_id: "pay_ghost" },
      })
    ).rejects.toThrow("Purchase not found")
  })
})

describe("handleWhopWebhook (router)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTx.product.findFirst.mockResolvedValue({
      id: "prod_1",
      name: "Product",
      slug: "product",
      pricingType: "ONE_TIME",
    })
    mockTx.user.findUnique.mockResolvedValue({ id: "usr_1", email: "a@b.com", name: "A" })
    mockTx.purchase.findUnique.mockResolvedValue(null)
  })

  it("should route payment.succeeded to handlePaymentSucceeded", async () => {
    await handleWhopWebhook({
      type: "payment.succeeded",
      data: {
        id: "pay_route_1",
        amount: 100,
        currency: "USD",
        customer_email: "a@b.com",
        product_id: "whop_1",
      },
    })
    expect(mockTx.purchase.create).toHaveBeenCalled()
  })

  it("should route membership.went_valid correctly", async () => {
    mockTx.productAccess.findFirst.mockResolvedValue({ id: "acc_1", product: {}, user: {} })

    await handleWhopWebhook({
      type: "membership.went_valid",
      data: { id: "mem_r1", user_id: "u1", product_id: "p1" },
    })
    expect(mockTx.productAccess.update).toHaveBeenCalled()
  })

  it("should route membership.went_invalid correctly", async () => {
    mockTx.productAccess.findFirst.mockResolvedValue({ id: "acc_2" })

    await handleWhopWebhook({
      type: "membership.went_invalid",
      data: { id: "mem_r2", user_id: "u1", product_id: "p1" },
    })
    expect(mockTx.productAccess.update).toHaveBeenCalled()
  })

  it("should route payment.refunded correctly", async () => {
    mockTx.purchase.findUnique.mockResolvedValue({ id: "p1", userId: "u1", productId: "pr1" })

    await handleWhopWebhook({
      type: "payment.refunded",
      data: { id: "ref_r1", original_payment_id: "pay_orig" },
    })
    expect(mockTx.purchase.update).toHaveBeenCalled()
  })

  it("should not throw for an unhandled event type", async () => {
    await expect(
      handleWhopWebhook({ type: "some.unknown.event", data: {} })
    ).resolves.not.toThrow()
  })
})
