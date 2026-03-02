/**
 * Whop webhook endpoint
 * Receives and processes payment/membership events from Whop
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyWhopSignature } from "@/lib/whop/verify-signature";
import { handleWhopWebhook } from "@/lib/whop/webhook-handler";
import { prisma } from "@/lib/db/prisma";
import { WhopWebhookSchema, WhopUnknownEventSchema } from "@/lib/validations";
import { webhookRateLimit, checkRedisRateLimit } from "@/lib/rate-limit";
import { getWhopWebhookSecret } from "@/lib/settings";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (Upstash Redis)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = await checkRedisRateLimit(webhookRateLimit, ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
          },
        }
      );
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-whop-signature");

    // Verify signature
    if (!signature) {
      Sentry.captureMessage("Missing x-whop-signature header");
      console.error("Missing x-whop-signature header");
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 401 }
      );
    }

    const secret = await getWhopWebhookSecret();
    if (!secret) {
      console.error("WHOP_WEBHOOK_SECRET not configured (DB or env)");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const isValid = verifyWhopSignature(rawBody, signature, secret);
    if (!isValid) {
      Sentry.captureMessage("Invalid webhook signature");
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse and validate payload
    const body = JSON.parse(rawBody);

    // First parse loosely to get event type for logging
    const looseParse = WhopUnknownEventSchema.parse(body);
    const eventType = looseParse.type;

    // Log webhook to database
    const webhookLog = await prisma.webhookLog.create({
      data: {
        event: eventType,
        payload: body,
        processed: false,
      },
    });

    // Try to parse as a known handled event
    const knownResult = WhopWebhookSchema.safeParse(body);
    if (!knownResult.success) {
      // Unknown/unhandled event type — log and return 200 so Whop doesn't retry
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { processed: true, success: true },
      });
      console.log(`Unhandled Whop event type: ${eventType} — acknowledged`);
      return NextResponse.json({ success: true, message: `Event ${eventType} acknowledged (not handled)` });
    }

    const validatedEvent = knownResult.data;

    // Process webhook event
    try {
      await handleWhopWebhook(validatedEvent);

      // Update webhook log to success
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          processed: true,
          success: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (handlerError) {
      console.error("Webhook handler error:", handlerError);

      // Capture error in Sentry
      Sentry.captureException(handlerError, {
        tags: {
          webhook_type: validatedEvent.type,
          webhook_id: validatedEvent.id,
        },
      });

      // Update webhook log to error
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          processed: true,
          success: false,
          error: handlerError instanceof Error ? handlerError.message : "Unknown error",
        },
      });

      return NextResponse.json(
        {
          error: "Webhook processing failed",
          details: handlerError instanceof Error ? handlerError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Webhook endpoint error:", error);

    // Capture error in Sentry
    Sentry.captureException(error);

    // Handle Zod validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Invalid webhook payload",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "whop-webhook",
    timestamp: new Date().toISOString(),
  });
}
