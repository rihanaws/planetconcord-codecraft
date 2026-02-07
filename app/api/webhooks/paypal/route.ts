/**
 * PayPal webhook endpoint
 * Receives and processes payment events from PayPal
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyPayPalSignature } from "@/lib/paypal/verify-signature"
import { handlePayPalWebhook } from "@/lib/paypal/webhook-handler"
import { prisma } from "@/lib/db/prisma"
import { webhookRateLimit, checkRedisRateLimit } from "@/lib/rate-limit"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (Upstash Redis)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const rateLimit = await checkRedisRateLimit(webhookRateLimit, ip)

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
      )
    }

    // Get raw body and PayPal headers
    const rawBody = await req.text()
    const transmissionId = req.headers.get("paypal-transmission-id")
    const transmissionTime = req.headers.get("paypal-transmission-time")
    const certUrl = req.headers.get("paypal-cert-url")
    const authAlgo = req.headers.get("paypal-auth-algo")
    const transmissionSig = req.headers.get("paypal-transmission-sig")

    // Verify required headers
    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      Sentry.captureMessage("Missing PayPal webhook headers")
      console.error("Missing required PayPal webhook headers")
      return NextResponse.json({ error: "Missing required headers" }, { status: 401 })
    }

    // Get webhook ID from environment
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (!webhookId) {
      console.error("PAYPAL_WEBHOOK_ID not configured")
      return NextResponse.json(
        { error: "Webhook ID not configured" },
        { status: 500 }
      )
    }

    // Verify signature using PayPal's API
    const isValid = await verifyPayPalSignature(
      webhookId,
      {
        transmissionId,
        transmissionTime,
        certUrl,
        authAlgo,
        transmissionSig,
      },
      rawBody
    )

    if (!isValid) {
      Sentry.captureMessage("Invalid PayPal webhook signature")
      console.error("Invalid PayPal webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const body = JSON.parse(rawBody)
    const eventType = body.event_type || "unknown"

    // Log webhook to database
    const webhookLog = await prisma.webhookLog.create({
      data: {
        event: eventType,
        payload: body,
        processed: false,
      },
    })

    // Process webhook event
    try {
      await handlePayPalWebhook(body)

      // Update webhook log to success
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          processed: true,
          success: true,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Webhook processed successfully",
      })
    } catch (handlerError) {
      console.error("PayPal webhook handler error:", handlerError)

      // Capture error in Sentry
      Sentry.captureException(handlerError, {
        tags: {
          webhook_type: eventType,
          webhook_id: body.id || "unknown",
        },
      })

      // Update webhook log to error
      await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          processed: true,
          success: false,
          error: handlerError instanceof Error ? handlerError.message : "Unknown error",
        },
      })

      return NextResponse.json(
        {
          error: "Webhook processing failed",
          details: handlerError instanceof Error ? handlerError.message : "Unknown error",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("PayPal webhook endpoint error:", error)

    // Capture error in Sentry
    Sentry.captureException(error)

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "paypal-webhook",
    timestamp: new Date().toISOString(),
  })
}
