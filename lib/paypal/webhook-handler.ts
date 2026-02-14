/**
 * PayPal webhook event handlers
 * Processes payment events and provisions access
 */

import crypto from "crypto"
import { prisma } from "@/lib/db/prisma"
import {
  sendPurchaseConfirmationEmail,
  sendAccessGrantedEmail,
  sendRefundProcessedEmail,
} from "@/lib/email/send"
import { hashPassword } from "@/lib/auth/utils"
import { UserRole, AccessStatus, PurchaseStatus, AccessType } from "@prisma/client"
import * as Sentry from "@sentry/nextjs"

type TransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>

interface PayPalResource {
  id: string
  amount: {
    total: string
    currency: string
  }
  state: string
  parent_payment?: string
  sale_id?: string
  custom?: string // JSON string with metadata
}

interface PayPalPaymentSaleCompleted {
  event_type: "PAYMENT.SALE.COMPLETED"
  resource: PayPalResource & {
    billing_agreement_id?: string
  }
}

interface PayPalPaymentSaleRefunded {
  event_type: "PAYMENT.SALE.REFUNDED"
  resource: PayPalResource & {
    sale_id: string
  }
}

type PayPalWebhookEvent = PayPalPaymentSaleCompleted | PayPalPaymentSaleRefunded

/**
 * Handle PAYMENT.SALE.COMPLETED event
 * Creates user account, grants product access, sends emails
 */
export async function handlePaymentSaleCompleted(
  event: PayPalPaymentSaleCompleted
): Promise<void> {
  const { id, amount, custom } = event.resource

  try {
    // Parse custom metadata (should contain productSlug, customerEmail, customerName)
    let metadata: {
      productSlug?: string
      customerEmail?: string
      customerName?: string
    } = {}

    if (custom) {
      try {
        metadata = JSON.parse(custom)
      } catch {
        console.warn("Failed to parse PayPal custom metadata:", custom)
      }
    }

    if (!metadata.productSlug || !metadata.customerEmail) {
      throw new Error("Missing required metadata (productSlug, customerEmail) in PayPal payment")
    }

    const paymentAmount = parseFloat(amount.total)

    await prisma.$transaction(async (tx: TransactionClient) => {
      // Find product by slug
      const product = await tx.product.findUnique({
        where: { slug: metadata.productSlug },
      })

      if (!product) {
        throw new Error(`Product not found: ${metadata.productSlug}`)
      }

      // Find or create user
      let user = await tx.user.findUnique({
        where: { email: metadata.customerEmail },
      })

      if (!user) {
        // Generate random password for auto-created accounts
        const randomPassword = crypto.randomBytes(32).toString("hex")
        const hashedPassword = await hashPassword(randomPassword)

        user = await tx.user.create({
          data: {
            email: metadata.customerEmail!,
            name: metadata.customerName || metadata.customerEmail!.split("@")[0],
            password: hashedPassword,
            role: UserRole.CUSTOMER,
            emailVerified: new Date(), // Auto-verify for paid customers
          },
        })
      }

      // Check for duplicate payment
      const existingPurchase = await tx.purchase.findFirst({
        where: { paypalPaymentId: id },
      })

      if (existingPurchase) {
        console.warn(`Duplicate PayPal payment ignored: ${id}`)
        return
      }

      // Create purchase record
      await tx.purchase.create({
        data: {
          userId: user.id,
          productId: product.id,
          paypalPaymentId: id,
          amount: paymentAmount,
          status: PurchaseStatus.COMPLETED,
          completedAt: new Date(),
        },
      })

      // Grant product access (upsert: reactivate if previously expired/revoked)
      const expiresAt =
        product.pricingType === "SUBSCRIPTION"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : null

      await tx.productAccess.upsert({
        where: {
          userId_productId: { userId: user.id, productId: product.id },
        },
        create: {
          userId: user.id,
          productId: product.id,
          status: AccessStatus.ACTIVE,
          accessType:
            product.pricingType === "SUBSCRIPTION"
              ? AccessType.SUBSCRIPTION
              : AccessType.LIFETIME,
          expiresAt,
        },
        update: {
          status: AccessStatus.ACTIVE,
          accessType:
            product.pricingType === "SUBSCRIPTION"
              ? AccessType.SUBSCRIPTION
              : AccessType.LIFETIME,
          expiresAt,
          revokedAt: null,
          revokedReason: null,
        },
      })

      // Send emails
      try {
        const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/products/${product.slug}`

        // Purchase confirmation
        await sendPurchaseConfirmationEmail(
          user.email,
          user.name || "Valued Customer",
          product.name,
          dashboardUrl,
          product.discordInviteUrl || undefined,
          amount.total,
          id
        )

        // Access granted
        const accessTypeLabel = product.pricingType === "SUBSCRIPTION" ? "SUBSCRIPTION" : "LIFETIME"
        await sendAccessGrantedEmail(
          user.email,
          user.name || "Valued Customer",
          product.name,
          dashboardUrl,
          accessTypeLabel
        )
      } catch (emailError) {
        console.error("Failed to send emails:", emailError)
        Sentry.captureException(emailError)
        // Don't fail transaction if email fails
      }
    })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { handler: "payment.sale.completed", payment_id: id },
    })
    throw error
  }
}

/**
 * Handle PAYMENT.SALE.REFUNDED event
 * Revokes product access
 */
export async function handlePaymentSaleRefunded(
  event: PayPalPaymentSaleRefunded
): Promise<void> {
  const { sale_id } = event.resource

  const refundInfo = await prisma.$transaction(async (tx: TransactionClient) => {
    const purchase = await tx.purchase.findFirst({
      where: { paypalPaymentId: sale_id },
      include: { user: true, product: true },
    })

    if (!purchase) {
      throw new Error(`Purchase not found for PayPal sale: ${sale_id}`)
    }

    // Update purchase status
    await tx.purchase.update({
      where: { id: purchase.id },
      data: {
        status: PurchaseStatus.REFUNDED,
        refundedAt: new Date(),
      },
    })

    // Revoke access for this product
    await tx.productAccess.updateMany({
      where: {
        userId: purchase.userId,
        productId: purchase.productId,
      },
      data: {
        status: AccessStatus.REVOKED,
        revokedAt: new Date(),
        revokedReason: "Payment refunded",
      },
    })

    return {
      email: purchase.user.email,
      name: purchase.user.name || "Valued Customer",
      productName: purchase.product.name,
      amount: String(purchase.amount),
      orderId: purchase.paypalPaymentId || undefined,
    }
  })

  // Send refund confirmation email
  try {
    await sendRefundProcessedEmail(
      refundInfo.email,
      refundInfo.name,
      refundInfo.productName,
      refundInfo.amount,
      refundInfo.orderId
    )
  } catch (emailError) {
    console.error("Failed to send refund email:", emailError)
    Sentry.captureException(emailError)
  }
}

/**
 * Main webhook event router
 */
export async function handlePayPalWebhook(
  event: Record<string, unknown>
): Promise<void> {
  const typedEvent = event as unknown as PayPalWebhookEvent
  switch (typedEvent.event_type) {
    case "PAYMENT.SALE.COMPLETED":
      await handlePaymentSaleCompleted(typedEvent as PayPalPaymentSaleCompleted)
      break
    case "PAYMENT.SALE.REFUNDED":
      await handlePaymentSaleRefunded(typedEvent as PayPalPaymentSaleRefunded)
      break
    default:
      console.warn(
        `Unhandled PayPal webhook event type: ${(typedEvent as { event_type?: string }).event_type}`
      )
  }
}
