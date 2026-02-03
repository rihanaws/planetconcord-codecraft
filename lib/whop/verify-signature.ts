/**
 * Whop webhook signature verification
 * Verifies webhook authenticity using HMAC-SHA256
 */

import crypto from "crypto";

/**
 * Verify Whop webhook signature
 * @param payload - Raw webhook payload (string)
 * @param signature - Signature from x-whop-signature header
 * @param secret - WHOP_WEBHOOK_SECRET from environment
 * @returns boolean - true if signature is valid
 */
export function verifyWhopSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Compute HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payload);
    const computedSignature = hmac.digest("hex");

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error("Error verifying Whop signature:", error);
    return false;
  }
}
