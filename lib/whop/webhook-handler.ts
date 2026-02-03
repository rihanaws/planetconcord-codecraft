/**
 * Whop webhook event handlers
 * Processes payment events and provisions access
 */

import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import {
  sendPurchaseConfirmationEmail,
  sendAccessGrantedEmail,
} from "@/lib/email/send";
import { hashPassword } from "@/lib/auth/utils";
import { UserRole, AccessStatus, PurchaseStatus, AccessType } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

interface PaymentSucceededEvent {
  type: "payment.succeeded";
  data: {
    id: string;
    amount: number;
    currency: string;
    customer_email: string;
    customer_name?: string;
    product_id: string;
    metadata?: {
      productSlug?: string;
    };
  };
}

interface MembershipValidEvent {
  type: "membership.went_valid";
  data: {
    id: string;
    user_id: string;
    product_id: string;
    valid_until?: string;
  };
}

interface MembershipInvalidEvent {
  type: "membership.went_invalid";
  data: {
    id: string;
    user_id: string;
    product_id: string;
  };
}

interface PaymentRefundedEvent {
  type: "payment.refunded";
  data: {
    id: string;
    original_payment_id: string;
  };
}

type WhopWebhookEvent =
  | PaymentSucceededEvent
  | MembershipValidEvent
  | MembershipInvalidEvent
  | PaymentRefundedEvent;

/**
 * Handle payment.succeeded event
 * Creates user account, grants product access, sends emails
 */
export async function handlePaymentSucceeded(
  event: PaymentSucceededEvent
): Promise<void> {
  const { id, amount, customer_email, customer_name, product_id, metadata } =
    event.data;

  try {
    // Start transaction
    await prisma.$transaction(async (tx) => {
    // Find product by Whop product ID or slug
    const product = await tx.product.findFirst({
      where: {
        OR: [
          { whopProductId: product_id },
          { slug: metadata?.productSlug || "" },
        ],
      },
    });

    if (!product) {
      throw new Error(`Product not found for Whop ID: ${product_id}`);
    }

    // Find or create user
    let user = await tx.user.findUnique({
      where: { email: customer_email },
    });

    if (!user) {
      // Generate random password for auto-created accounts
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await tx.user.create({
        data: {
          email: customer_email,
          name: customer_name || customer_email.split("@")[0],
          password: hashedPassword,
          role: UserRole.CUSTOMER,
          emailVerified: new Date(), // Auto-verify for paid customers
        },
      });
    }

    // Check for duplicate payment
    const existingPurchase = await tx.purchase.findUnique({
      where: { whopPaymentId: id },
    });

    if (existingPurchase) {
      console.log(`Duplicate payment ignored: ${id}`);
      return;
    }

    // Create purchase record
    await tx.purchase.create({
      data: {
        userId: user.id,
        productId: product.id,
        whopPaymentId: id,
        amount,
        status: PurchaseStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Grant product access
    const expiresAt =
      product.pricingType === "SUBSCRIPTION"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : null;

    await tx.productAccess.create({
      data: {
        userId: user.id,
        productId: product.id,
        status: AccessStatus.ACTIVE,
        accessType: product.pricingType === "SUBSCRIPTION" ? AccessType.SUBSCRIPTION : AccessType.LIFETIME,
        expiresAt,
      },
    });

    // Send emails
    try {
      const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard/products/${product.slug}`;

      // Purchase confirmation
      await sendPurchaseConfirmationEmail(
        user.email,
        user.name || "Valued Customer",
        product.name,
        dashboardUrl
      );

      // Access granted
      await sendAccessGrantedEmail(
        user.email,
        user.name || "Valued Customer",
        product.name,
        dashboardUrl
      );
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
      Sentry.captureException(emailError);
      // Don't fail transaction if email fails
    }
    });

    console.log(`Payment processed successfully: ${id}`);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { handler: "payment.succeeded", payment_id: id },
    });
    throw error;
  }
}

/**
 * Handle membership.went_valid event
 * Activates subscription access
 */
export async function handleMembershipValid(
  event: MembershipValidEvent
): Promise<void> {
  const { id, valid_until } = event.data;

  await prisma.$transaction(async (tx) => {
    const productAccess = await tx.productAccess.findFirst({
      where: { whopMembershipId: id },
      include: { product: true, user: true },
    });

    if (!productAccess) {
      throw new Error(`ProductAccess not found for membership: ${id}`);
    }

    await tx.productAccess.update({
      where: { id: productAccess.id },
      data: {
        status: AccessStatus.ACTIVE,
        expiresAt: valid_until ? new Date(valid_until) : null,
      },
    });

    console.log(`Membership activated: ${id}`);
  });
}

/**
 * Handle membership.went_invalid event
 * Expires subscription access
 */
export async function handleMembershipInvalid(
  event: MembershipInvalidEvent
): Promise<void> {
  const { id } = event.data;

  await prisma.$transaction(async (tx) => {
    const productAccess = await tx.productAccess.findFirst({
      where: { whopMembershipId: id },
    });

    if (!productAccess) {
      throw new Error(`ProductAccess not found for membership: ${id}`);
    }

    await tx.productAccess.update({
      where: { id: productAccess.id },
      data: {
        status: AccessStatus.EXPIRED,
        revokedAt: new Date(),
      },
    });

    console.log(`Membership expired: ${id}`);
  });
}

/**
 * Handle payment.refunded event
 * Revokes product access
 */
export async function handlePaymentRefunded(
  event: PaymentRefundedEvent
): Promise<void> {
  const { original_payment_id } = event.data;

  await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUnique({
      where: { whopPaymentId: original_payment_id },
    });

    if (!purchase) {
      throw new Error(`Purchase not found: ${original_payment_id}`);
    }

    // Update purchase status
    await tx.purchase.update({
      where: { id: purchase.id },
      data: {
        status: PurchaseStatus.REFUNDED,
        refundedAt: new Date(),
      },
    });

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
    });

    console.log(`Payment refunded and access revoked: ${original_payment_id}`);
  });
}

/**
 * Main webhook event router
 */
export async function handleWhopWebhook(
  event: Record<string, unknown>
): Promise<void> {
  const typedEvent = event as unknown as WhopWebhookEvent;
  switch (typedEvent.type) {
    case "payment.succeeded":
      await handlePaymentSucceeded(typedEvent as PaymentSucceededEvent);
      break;
    case "membership.went_valid":
      await handleMembershipValid(typedEvent as MembershipValidEvent);
      break;
    case "membership.went_invalid":
      await handleMembershipInvalid(typedEvent as MembershipInvalidEvent);
      break;
    case "payment.refunded":
      await handlePaymentRefunded(typedEvent as PaymentRefundedEvent);
      break;
    default:
      console.log(`Unhandled event type`);
  }
}
