import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import * as Sentry from "@sentry/nextjs"
import { format } from "date-fns"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { purchaseId } = await params

    // Fetch purchase with user and product
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        product: { select: { id: true, name: true, slug: true, price: true, pricingType: true } },
      },
    })

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    // Fetch product access for this user+product
    const access = await prisma.productAccess.findFirst({
      where: {
        userId: purchase.userId,
        productId: purchase.productId,
      },
    })

    // Fetch all user activity
    const allActivities = await prisma.userActivity.findMany({
      where: { userId: purchase.userId },
      orderBy: { createdAt: "asc" },
    })

    // Filter activities related to this product
    const productActivities = allActivities.filter((a) => {
      if (!a.metadata || typeof a.metadata !== "object") return false
      const meta = a.metadata as Record<string, unknown>
      return meta.productId === purchase.productId || meta.slug === purchase.product.slug
    })

    // Build activity summary
    const loginCount = allActivities.filter((a) => a.action === "LOGIN").length
    const pageViewCount = allActivities.filter((a) => a.action === "PAGE_VIEW").length
    const downloadCount = allActivities.filter((a) => a.action === "CONTENT_DOWNLOAD").length
    const videoAnalyzeCount = allActivities.filter((a) => a.action === "VIDEO_ANALYZE").length
    const serviceRequestCount = allActivities.filter((a) => a.action === "SERVICE_REQUEST").length

    const firstActivity = allActivities[0]?.createdAt ?? null
    const lastActivity = allActivities[allActivities.length - 1]?.createdAt ?? null

    // Calculate unique days active
    const uniqueDays = new Set(
      allActivities.map((a) => format(new Date(a.createdAt), "yyyy-MM-dd"))
    )

    // Build dispute statement
    const purchaseDate = format(new Date(purchase.createdAt), "MMM d, yyyy")
    const accessTypeStr = access?.accessType ?? "UNKNOWN"
    const deliveryDate = access?.deliveredAt
      ? format(new Date(access.deliveredAt), "MMM d, yyyy")
      : purchase.deliveredAt
        ? format(new Date(purchase.deliveredAt), "MMM d, yyyy")
        : purchaseDate
    const lastActivityDate = lastActivity ? format(new Date(lastActivity), "MMM d, yyyy") : "N/A"

    const activityParts = []
    if (loginCount > 0) activityParts.push(`${loginCount} logins`)
    if (pageViewCount > 0) activityParts.push(`${pageViewCount} page views`)
    if (downloadCount > 0) activityParts.push(`${downloadCount} downloads`)
    if (videoAnalyzeCount > 0) activityParts.push(`${videoAnalyzeCount} video analyses`)
    if (serviceRequestCount > 0) activityParts.push(`${serviceRequestCount} service requests`)

    const disputeStatement = `Customer purchased '${purchase.product.name}' on ${purchaseDate} for $${purchase.amount.toFixed(2)}. Access was delivered on ${deliveryDate} (${accessTypeStr}). The customer was active for ${uniqueDays.size} days with ${allActivities.length} recorded events${activityParts.length > 0 ? ` including ${activityParts.join(", ")}` : ""}. Last activity was ${lastActivityDate}. This demonstrates full delivery and active use of the digital product.`

    const evidence = {
      generatedAt: new Date().toISOString(),
      customer: {
        name: purchase.user.name,
        email: purchase.user.email,
        createdAt: purchase.user.createdAt,
      },
      purchase: {
        id: purchase.id,
        amount: purchase.amount,
        status: purchase.status,
        createdAt: purchase.createdAt,
        completedAt: purchase.completedAt,
        deliveredAt: purchase.deliveredAt,
        deliveryConfirmed: purchase.deliveryConfirmed,
        whopPaymentId: purchase.whopPaymentId,
        paypalPaymentId: purchase.paypalPaymentId,
      },
      product: {
        name: purchase.product.name,
        slug: purchase.product.slug,
        price: purchase.product.price,
        pricingType: purchase.product.pricingType,
      },
      access: access
        ? {
            status: access.status,
            accessType: access.accessType,
            grantedAt: access.grantedAt,
            expiresAt: access.expiresAt,
            revokedAt: access.revokedAt,
            revokedReason: access.revokedReason,
            deliveryStatus: access.deliveryStatus,
            deliveredAt: access.deliveredAt,
          }
        : null,
      activitySummary: {
        totalEvents: allActivities.length,
        productSpecificEvents: productActivities.length,
        firstActivity,
        lastActivity,
        daysActive: uniqueDays.size,
        loginCount,
        pageViewCount,
        downloadCount,
        videoAnalyzeCount,
        serviceRequestCount,
      },
      timeline: allActivities.map((a) => ({
        date: a.createdAt,
        action: a.action,
        metadata: a.metadata,
      })),
      disputeStatement,
    }

    return NextResponse.json(evidence)
  } catch (error) {
    console.error("Dispute evidence error:", error)
    Sentry.captureException(error, { tags: { route: "admin/disputes/evidence", method: "GET" } })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
