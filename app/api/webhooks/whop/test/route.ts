/**
 * Manual webhook trigger endpoint (dev only)
 * Allows manual testing of webhook handlers
 */

import { NextRequest, NextResponse } from "next/server";
import { handleWhopWebhook } from "@/lib/whop/webhook-handler";
import {
  generatePaymentSucceededPayload,
  generateMembershipValidPayload,
  generateMembershipInvalidPayload,
  generatePaymentRefundedPayload,
} from "@/lib/whop/test-payloads";

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test endpoint not available in production" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { eventType, ...options } = body;

    let payload;

    switch (eventType) {
      case "payment.succeeded":
        payload = generatePaymentSucceededPayload(options);
        break;
      case "membership.went_valid":
        payload = generateMembershipValidPayload(options);
        break;
      case "membership.went_invalid":
        payload = generateMembershipInvalidPayload(options);
        break;
      case "payment.refunded":
        payload = generatePaymentRefundedPayload(options);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 }
        );
    }

    // Process webhook
    await handleWhopWebhook(payload);

    return NextResponse.json({
      success: true,
      message: "Test webhook processed",
      payload,
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json(
      {
        error: "Failed to process test webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
