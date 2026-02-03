/**
 * Webhook replay functionality (admin only)
 * Allows admins to replay failed webhooks
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleWhopWebhook } from "@/lib/whop/webhook-handler";
import { requireAdmin } from "@/lib/auth/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { id } = await params;

    // Find the webhook log
    const webhookLog = await prisma.webhookLog.findUnique({
      where: { id },
    });

    if (!webhookLog) {
      return NextResponse.json(
        { error: "Webhook log not found" },
        { status: 404 }
      );
    }

    // Replay the webhook
    try {
      await handleWhopWebhook(webhookLog.payload as Record<string, unknown>);

      // Update webhook log
      await prisma.webhookLog.update({
        where: { id },
        data: {
          processed: true,
          success: true,
          error: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Webhook replayed successfully",
      });
    } catch (replayError) {
      // Update webhook log with new error
      await prisma.webhookLog.update({
        where: { id },
        data: {
          processed: true,
          success: false,
          error: replayError instanceof Error ? replayError.message : "Unknown error",
        },
      });

      return NextResponse.json(
        {
          error: "Webhook replay failed",
          details: replayError instanceof Error ? replayError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    console.error("Webhook replay error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
