/**
 * PayPal webhook signature verification
 * Uses PayPal's verification API to validate webhook authenticity
 */

interface PayPalVerificationResponse {
  verification_status: "SUCCESS" | "FAILURE"
}

/**
 * Verify PayPal webhook signature using PayPal's verification API
 * https://developer.paypal.com/api/rest/webhooks/rest/#verify-webhook-signature
 */
export async function verifyPayPalSignature(
  webhookId: string,
  headers: {
    transmissionId: string
    transmissionTime: string
    certUrl: string
    authAlgo: string
    transmissionSig: string
  },
  body: string
): Promise<boolean> {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const env = process.env.NEXT_PUBLIC_PAYPAL_ENV || "production"

    if (!clientId || !clientSecret) {
      console.error("PayPal credentials not configured")
      return false
    }

    // Get PayPal access token
    const authUrl =
      env === "sandbox"
        ? "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        : "https://api-m.paypal.com/v1/oauth2/token"

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!authResponse.ok) {
      console.error("Failed to get PayPal access token")
      return false
    }

    const authData: { access_token: string } = await authResponse.json()

    // Verify webhook signature
    const verifyUrl =
      env === "sandbox"
        ? "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature"
        : "https://api-m.paypal.com/v1/notifications/verify-webhook-signature"

    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        transmission_id: headers.transmissionId,
        transmission_time: headers.transmissionTime,
        cert_url: headers.certUrl,
        auth_algo: headers.authAlgo,
        transmission_sig: headers.transmissionSig,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    })

    if (!verifyResponse.ok) {
      console.error("PayPal signature verification failed")
      return false
    }

    const verifyData: PayPalVerificationResponse = await verifyResponse.json()
    return verifyData.verification_status === "SUCCESS"
  } catch (error) {
    console.error("PayPal signature verification error:", error)
    return false
  }
}
