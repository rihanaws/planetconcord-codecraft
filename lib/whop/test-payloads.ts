/**
 * Test webhook payload generators — Whop V1 API event names
 */

/** invoice_paid — triggers when a payment completes (replaces payment.succeeded) */
export function generatePaymentSucceededPayload(options?: {
  email?: string;
  name?: string;
  amount?: number;
  productSlug?: string;
}) {
  return {
    type: "invoice_paid",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      final_amount: options?.amount || 149,
      amount: options?.amount || 149,
      currency: "USD",
      customer_email: options?.email || "test@example.com",
      customer_name: options?.name || "Test Customer",
      product_id: "prod_test_123",
      metadata: {
        productSlug: options?.productSlug || "email-newsletter-starter-pack",
      },
    },
  };
}

/** membership_activated — triggers when access goes valid (replaces membership.went_valid) */
export function generateMembershipValidPayload(options?: {
  membershipId?: string;
  userId?: string;
  validUntil?: string;
}) {
  return {
    type: "membership_activated",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: options?.membershipId || `mem_${Date.now()}`,
      user_id: options?.userId || `user_${Date.now()}`,
      product_id: "prod_test_123",
      valid_until: options?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
  };
}

/** membership_deactivated — triggers when access goes invalid (replaces membership.went_invalid) */
export function generateMembershipInvalidPayload(options?: {
  membershipId?: string;
  userId?: string;
}) {
  return {
    type: "membership_deactivated",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: options?.membershipId || `mem_${Date.now()}`,
      user_id: options?.userId || `user_${Date.now()}`,
      product_id: "prod_test_123",
      status: "expired",
    },
  };
}

/** Kept for backwards compat but no longer handled — Whop V1 uses invoice_paid */
export function generatePaymentRefundedPayload(options?: {
  originalPaymentId?: string;
}) {
  return {
    type: "payment.refunded",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      original_payment_id: options?.originalPaymentId || `pay_${Date.now()}`,
    },
  };
}
