import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { UserRole } from "@prisma/client"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DisputePrintButton } from "@/components/admin/dispute-print-button"
import {
  ArrowLeft,
  User,
  ShoppingCart,
  Package,
  Activity,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
} from "lucide-react"

// Whop access log for George's purchase (from Whop dispute evidence page)
const WHOP_ACCESS_LOG = [
  {
    datetime: "2026-02-02 22:28:47 +0200",
    action: "Membership checkout was completed through a direct to consumer link",
  },
  {
    datetime: "2026-02-02 22:28:47 +0200",
    action: "User explicitly agreed to the terms of service during the checkout process.",
  },
  {
    datetime: "2026-02-02 22:28:49 +0200",
    action: "User has been emailed information about their purchase",
  },
  {
    datetime: "2026-02-17 20:53:42 +0200",
    action: "Subscription status changed from completed to canceled",
  },
  {
    datetime: "2026-02-17 20:53:42 +0200",
    action: "Cancelling from status change",
  },
  {
    datetime: "2026-02-17 20:53:42 +0200",
    action: "Membership was terminated because a payment for the membership received a dispute protection alert.",
  },
  {
    datetime: "2026-02-17 20:53:42 +0200",
    action: "Sent email to the customer informing them of the membership's cancellation.",
  },
]

async function getDisputeData(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true, emailVerified: true } },
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          pricingType: true,
          deliverables: true,
          features: true,
        },
      },
    },
  })

  if (!purchase) return null

  const access = await prisma.productAccess.findFirst({
    where: { userId: purchase.userId, productId: purchase.productId },
  })

  const activities = await prisma.userActivity.findMany({
    where: { userId: purchase.userId },
    orderBy: { createdAt: "asc" },
  })

  return { purchase, access, activities }
}

async function DisputeContent({ purchaseId }: { purchaseId: string }) {
  const session = await auth()
  if (!session?.user?.id) redirect(`/login?callbackUrl=/admin/disputes/${purchaseId}`)
  if (session.user.role !== UserRole.ADMIN) redirect("/dashboard?error=unauthorized")

  const data = await getDisputeData(purchaseId)
  if (!data) notFound()

  const { purchase, access, activities } = data

  const timeline = [
    {
      date: purchase.createdAt,
      label: "Purchase completed",
      detail: `$${purchase.amount.toFixed(2)} charged via Whop (${purchase.whopPaymentId})`,
      type: "success",
    },
    {
      date: access?.grantedAt ?? purchase.createdAt,
      label: "LIFETIME access granted",
      detail: `Access to ${purchase.product.name} granted immediately`,
      type: "success",
    },
    ...(purchase.user.emailVerified
      ? [
          {
            date: purchase.user.emailVerified,
            label: "Customer verified email",
            detail: `${purchase.user.email} — confirms account ownership`,
            type: "success",
          },
        ]
      : []),
    ...(access?.deliveredAt
      ? [
          {
            date: access.deliveredAt,
            label: "Product marked delivered",
            detail: "All deliverables confirmed by merchant",
            type: "success",
          },
        ]
      : purchase.deliveredAt
        ? [
            {
              date: purchase.deliveredAt,
              label: "Product marked delivered",
              detail: "All deliverables confirmed by merchant",
              type: "success",
            },
          ]
        : []),
    ...(access?.revokedAt
      ? [
          {
            date: access.revokedAt,
            label: "Access revoked",
            detail: access.revokedReason ?? "Chargeback initiated",
            type: "warning",
          },
        ]
      : []),
    ...activities.map((a) => ({
      date: a.createdAt,
      label: a.action.replace(/_/g, " "),
      detail: "",
      type: "activity",
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const daysBetweenPurchaseAndDispute = Math.round(
    (new Date("2026-02-26").getTime() - new Date(purchase.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const deliveryDate =
    access?.deliveredAt ?? purchase.deliveredAt ?? null

  return (
    <div className="space-y-8" id="dispute-content">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <Link
            href="/admin/purchases"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Purchases
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Dispute Evidence</h1>
          <p className="text-muted-foreground mt-1">
            {purchase.product.name} — {purchase.user.name} ({purchase.user.email})
          </p>
        </div>
        <DisputePrintButton />
      </div>

      {/* Print header — only shows when printing */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">DISPUTE EVIDENCE REPORT</h1>
            <p className="text-sm text-gray-600">CodeCraft Agency (TechSci Inc.) — codecraft.techsci.xyz</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Generated: {format(new Date(), "MMM d, yyyy 'at' h:mm a")}</p>
            <p>support@techsci.xyz</p>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-destructive text-sm">Dispute Active — No Cardholder Authorisation</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Filed {daysBetweenPurchaseAndDispute} days after purchase.{" "}
            {deliveryDate && (
              <>
                Product was delivered on {format(new Date(deliveryDate), "MMM d, yyyy")} —{" "}
                {Math.round(
                  (new Date("2026-02-26").getTime() - new Date(deliveryDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days before dispute.
              </>
            )}
            {" "}Deadline: <strong>April 6, 2026</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
        {/* Customer Details */}
        <section className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Customer</h2>
          </div>
          <Row label="Name" value={purchase.user.name ?? "N/A"} />
          <Row label="Email" value={purchase.user.email} mono />
          <Row label="User ID" value={purchase.user.id} mono small />
          <Row label="Account Created" value={format(new Date(purchase.user.createdAt), "MMM d, yyyy 'at' h:mm a 'UTC'")} />
          <Row
            label="Email Verified"
            value={
              purchase.user.emailVerified
                ? format(new Date(purchase.user.emailVerified), "MMM d, yyyy 'at' h:mm a 'UTC'")
                : "Not verified"
            }
            highlight={!!purchase.user.emailVerified}
          />
          <Row label="Billing Address" value="Jane Owens, 449 SW Kaabe Ave, Port St. Lucie, FL 34953, US" />
          <Row label="Payment Card" value="Mastercard ending 6604" />
        </section>

        {/* Transaction Details */}
        <section className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Transaction</h2>
          </div>
          <Row label="Whop Payment ID" value={purchase.whopPaymentId ?? "N/A"} mono />
          <Row label="Internal Purchase ID" value={purchase.id} mono small />
          <Row label="Purchase Date" value={format(new Date(purchase.createdAt), "MMM d, yyyy 'at' h:mm a 'UTC'")} />
          <Row label="Amount Charged" value={`$${purchase.amount.toFixed(2)} USD`} highlight />
          <Row label="List Price" value={`$${purchase.product.price.toFixed(2)} USD`} />
          <Row label="Status" value={purchase.status} badge />
          <Row label="Platform" value="Whop (whop.com)" />
          <Row label="Checkout Method" value="Direct-to-consumer link" />
        </section>

        {/* Product Access */}
        <section className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Product Access</h2>
          </div>
          <Row label="Product" value={purchase.product.name} />
          <Row label="Access Type" value={access?.accessType ?? "LIFETIME"} badge />
          <Row label="Access Status" value={access?.status ?? "N/A"} badge />
          <Row
            label="Granted At"
            value={access ? format(new Date(access.grantedAt), "MMM d, yyyy 'at' h:mm a 'UTC'") : "N/A"}
          />
          <Row
            label="Delivery Status"
            value={access?.deliveryStatus ?? (purchase.deliveryConfirmed ? "DELIVERED" : "PENDING")}
            badge
            highlight={access?.deliveryStatus === "DELIVERED" || purchase.deliveryConfirmed}
          />
          <Row
            label="Delivered At"
            value={
              access?.deliveredAt
                ? format(new Date(access.deliveredAt), "MMM d, yyyy 'at' h:mm a 'UTC'")
                : purchase.deliveredAt
                  ? format(new Date(purchase.deliveredAt), "MMM d, yyyy 'at' h:mm a 'UTC'")
                  : "N/A"
            }
            highlight={!!deliveryDate}
          />
          {access?.revokedAt && (
            <Row
              label="Revoked At"
              value={format(new Date(access.revokedAt), "MMM d, yyyy 'at' h:mm a 'UTC'")}
            />
          )}
          {access?.revokedReason && (
            <Row label="Revocation Reason" value={access.revokedReason} />
          )}
        </section>

        {/* Deliverables */}
        <section className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Deliverables Provided
            </h2>
          </div>
          {Array.isArray(purchase.product.deliverables) && purchase.product.deliverables.length > 0 ? (
            <ul className="space-y-2">
              {(purchase.product.deliverables as string[]).map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {d}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No deliverables listed</p>
          )}
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
            Access via: codecraft.techsci.xyz/dashboard
          </p>
        </section>
      </div>

      {/* Whop Access Log */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-blue-500" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Whop Platform Access Log
          </h2>
          <Badge variant="secondary" className="text-xs ml-auto">Source: Whop Dispute Evidence Page</Badge>
        </div>
        <div className="rounded-lg bg-muted/50 border border-border/30 overflow-hidden">
          <div className="px-4 py-2 bg-muted/80 border-b border-border/30 text-xs text-muted-foreground font-mono">
            On February 02, 2026, the customer completed a purchase and agreed to Whop&apos;s Terms of Service
            and the seller&apos;s Terms of Service during checkout.
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/30">
                <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground w-56">Date &amp; Time</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {WHOP_ACCESS_LOG.map((entry, i) => (
                <tr
                  key={i}
                  className={`border-b border-border/20 last:border-0 ${
                    entry.action.includes("agreed to the terms") ? "bg-green-500/5" :
                    entry.action.includes("dispute") || entry.action.includes("terminated") ? "bg-amber-500/5" :
                    ""
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap align-top">
                    {entry.datetime}
                  </td>
                  <td className="px-4 py-2.5 text-sm">
                    {entry.action.includes("agreed to the terms") ? (
                      <span className="font-medium text-green-600 dark:text-green-400">{entry.action}</span>
                    ) : entry.action.includes("dispute") || entry.action.includes("terminated") ? (
                      <span className="text-amber-600 dark:text-amber-400">{entry.action}</span>
                    ) : (
                      entry.action
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Platform Event Timeline
          </h2>
          {activities.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-auto">{activities.length} activity events</Badge>
          )}
        </div>
        <div className="space-y-2">
          {timeline.map((event, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="shrink-0 w-40 text-xs text-muted-foreground pt-0.5 font-mono">
                {format(new Date(event.date), "MMM d, yyyy")}
                <br />
                {format(new Date(event.date), "h:mm a")}
              </div>
              <div className="shrink-0 pt-1.5">
                {event.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : event.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-400" />
                )}
              </div>
              <div className="pt-0.5">
                <p className="font-medium">{event.label}</p>
                {event.detail && <p className="text-xs text-muted-foreground">{event.detail}</p>}
              </div>
            </div>
          ))}
        </div>
        {activities.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            No UserActivity events recorded (activity logging was added after this purchase).
          </p>
        )}
      </section>

      {/* Dispute Rebuttal Statement */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm uppercase tracking-wide">Dispute Rebuttal Statement</h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            We dispute this chargeback in full. The claim of &ldquo;No cardholder authorisation&rdquo; is false and contradicted by the evidence above.
          </p>
          <p>
            <strong>1. Authorized checkout:</strong> On {format(new Date(purchase.createdAt), "MMMM d, yyyy")}, the customer completed a purchase via Whop&apos;s direct-to-consumer checkout. Whop&apos;s own log confirms: &ldquo;User explicitly agreed to the terms of service during the checkout process.&rdquo;
          </p>
          {purchase.user.emailVerified && (
            <p>
              <strong>2. Email verification:</strong> On {format(new Date(purchase.user.emailVerified), "MMMM d, yyyy")} — {Math.round((new Date(purchase.user.emailVerified).getTime() - new Date(purchase.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days after purchase — the customer verified their email ({purchase.user.email}) by clicking a confirmation link. This proves they control the account and email associated with this transaction.
            </p>
          )}
          {deliveryDate && (
            <p>
              <strong>3. Full delivery — non-refundable under our policy:</strong> The product was marked delivered on {format(new Date(deliveryDate), "MMMM d, yyyy")} — {Math.round((new Date("2026-02-26").getTime() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24))} days before the dispute was filed. All {Array.isArray(purchase.product.deliverables) ? purchase.product.deliverables.length : 0} deliverables were provided. Per our Return &amp; Refund Policy (agreed to at checkout), services are <strong>non-refundable after Phase 1 delivery</strong> — the milestone-based policy governs, not a blanket &ldquo;30-day guarantee.&rdquo;
            </p>
          )}
          <p>
            <strong>4. Refund policy breach:</strong> Our Terms of Service (codecraft.techsci.xyz/terms, Section 7) and Refund Policy (codecraft.techsci.xyz/refund) explicitly state that chargebacks filed without prior contact are a breach of contract. The customer never contacted support@techsci.xyz, billing@techsci.io, or the Whop Resolution Center before filing. Our response time is under 4 hours — any legitimate issue would have been resolved immediately.
          </p>
          <p>
            <strong>5. {daysBetweenPurchaseAndDispute}-day gap — friendly fraud pattern:</strong> The dispute was filed {daysBetweenPurchaseAndDispute} days after purchase, {deliveryDate ? `${Math.round((new Date("2026-02-26").getTime() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24))} days after receiving the full product` : "after receiving the full product"}. This is consistent with friendly fraud — a customer who consumed a digital product then filed a false unauthorized-use claim to obtain it for free.
          </p>
          <p className="pt-2 border-t border-border/30 text-muted-foreground">
            We request the issuing bank uphold the original charge of ${purchase.amount.toFixed(2)} USD in favor of the merchant. The transaction was legitimate, authorized, fully delivered, and non-refundable under the merchant&apos;s milestone-based policy agreed to at checkout.
          </p>
        </div>
      </section>

      {/* Refund Policy Argument */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Refund Policy — Why No Refund Is Owed
          </h2>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Our Return &amp; Refund Policy (published at{" "}
            <strong>codecraft.techsci.xyz/refund</strong>, last updated January 28, 2026) is
            milestone-based. The customer agreed to this policy at checkout per Whop&apos;s own log.
          </p>
          <div className="rounded-lg bg-muted/50 border border-border/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Phase</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Status in This Case</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Refundable?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Days 0–7 (Onboarding)", "Purchase was Feb 2 — this window expired Feb 9", "No — window closed"],
                  ["Phase 1: Strategy & Deliverables", "Delivered Feb 15 — customer had access for 13 days before dispute", "No — intellectual work delivered"],
                  ["Phase 2: Content & Execution", deliveryDate ? `Delivered by ${format(new Date(deliveryDate), "MMM d, yyyy")}` : "Delivered", "No — deliverables produced"],
                  ["After 90 Days", "Not yet reached, but all phases delivered", "No — service complete"],
                ].map(([phase, status, refundable], i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0">
                    <td className="px-4 py-2.5 text-xs font-medium">{phase}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{status}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-red-500">{refundable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            The customer also never attempted to use the Whop Resolution Center or contact us directly —
            a requirement explicitly stated in our Terms of Service (Section 7) before any dispute
            mechanism is pursued. The chargeback is therefore also a breach of contract.
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="text-xs text-muted-foreground border-t border-border/50 pt-4 flex justify-between print:text-black">
        <span>CodeCraft Agency (TechSci Inc.) — support@techsci.xyz — codecraft.techsci.xyz</span>
        <span>Generated {format(new Date(), "MMM d, yyyy 'at' h:mm a")}</span>
      </div>
    </div>
  )
}

// Reusable row component
function Row({
  label,
  value,
  mono,
  small,
  highlight,
  badge,
}: {
  label: string
  value: string
  mono?: boolean
  small?: boolean
  highlight?: boolean
  badge?: boolean
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      {badge ? (
        <Badge variant={value === "COMPLETED" || value === "LIFETIME" || value === "DELIVERED" ? "default" : value === "REVOKED" ? "destructive" : "secondary"} className="text-xs">
          {value}
        </Badge>
      ) : (
        <span
          className={[
            mono ? "font-mono" : "font-medium",
            small ? "text-xs" : "",
            highlight ? "text-green-600 dark:text-green-400 font-semibold" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {value}
        </span>
      )}
    </div>
  )
}

export default function DisputePage({
  params,
}: {
  params: Promise<{ purchaseId: string }>
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <Suspense fallback={<DisputeSkeleton />}>
        <DisputePageInner params={params} />
      </Suspense>
    </div>
  )
}

async function DisputePageInner({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params
  return <DisputeContent purchaseId={purchaseId} />
}

function DisputeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
