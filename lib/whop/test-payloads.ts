/**
 * Test webhook payload generators
 * Generate realistic webhook payloads for testing
 */

/**
 * Generate a test payment.succeeded payload
 */
export function generatePaymentSucceededPayload(options?: {
  email?: string;
  name?: string;
  amount?: number;
  productSlug?: string;
}) {
  return {
    type: "payment.succeeded",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
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

/**
 * Generate a test membership.went_valid payload
 */
export function generateMembershipValidPayload(options?: {
  membershipId?: string;
  userId?: string;
  validUntil?: string;
}) {
  return {
    type: "membership.went_valid",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: options?.membershipId || `mem_${Date.now()}`,
      user_id: options?.userId || `user_${Date.now()}`,
      product_id: "prod_test_123",
      valid_until: options?.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

/**
 * Generate a test membership.went_invalid payload
 */
export function generateMembershipInvalidPayload(options?: {
  membershipId?: string;
  userId?: string;
}) {
  return {
    type: "membership.went_invalid",
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    data: {
      id: options?.membershipId || `mem_${Date.now()}`,
      user_id: options?.userId || `user_${Date.now()}`,
      product_id: "prod_test_123",
    },
  };
}

/**
 * Generate a test payment.refunded payload
 */
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
