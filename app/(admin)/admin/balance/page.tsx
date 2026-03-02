"use client"

import { useEffect, useState, useCallback } from "react"
import { formatInTimeZone } from "date-fns-tz"
import {
  Wallet,
  Clock,
  Lock,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ArrowDownToLine,
  Building2,
  BadgeCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// ── Types ──────────────────────────────────────────────────────────────────

interface BalanceEntry {
  balance: number
  currency: string
  pending_balance: number
  reserve_balance: number
}

interface LedgerAccount {
  id: string
  balances: BalanceEntry[]
  transfer_fee: number | null
  ledger_type: string
  owner: { id: string; name: string | null; username: string }
  payout_account_details?: {
    email: string | null
    business_name: string | null
    latest_verification?: {
      status: string
      last_error_reason: string | null
    }
  }
  payments_approval_status: string | null
}

interface Withdrawal {
  id: string
  amount: number
  currency: string
  status: string
  created_at: string
  completed_at: string | null
  payout_method?: { type: string }
}

interface ApiResponse {
  ledger: LedgerAccount
  withdrawals: Withdrawal[]
  fetchedAt: string
  error?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100) // Whop returns amounts in cents
}

function fmtUtc(dateStr: string) {
  return formatInTimeZone(new Date(dateStr), "UTC", "MMM d, yyyy 'at' h:mm a 'UTC'")
}

function WithdrawalStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (s === "completed" || s === "succeeded")
    return <Badge className="bg-green-500/15 text-green-600 border-green-500/20 hover:bg-green-500/15">{status}</Badge>
  if (s === "pending" || s === "processing")
    return <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/15">{status}</Badge>
  if (s === "failed" || s === "cancelled")
    return <Badge variant="destructive">{status}</Badge>
  return <Badge variant="secondary">{status}</Badge>
}

function VerificationBadge({ status }: { status: string }) {
  if (status === "verified")
    return <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>
  if (status === "requires_input")
    return <span className="flex items-center gap-1 text-amber-600 text-xs font-medium"><AlertTriangle className="h-3.5 w-3.5" /> Requires input</span>
  return <span className="text-xs text-muted-foreground">{status}</span>
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function WhopBalancePage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/whop-balance")
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || "Failed to fetch balance")
      } else {
        setData(json)
      }
    } catch {
      setError("Network error — could not reach the server")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchBalance() }, [fetchBalance])

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Whop Balance</h1>
            <p className="text-muted-foreground mt-1">Live balance synced from Whop</p>
          </div>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">Failed to load Whop balance</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            {error.includes("not configured") && (
              <p className="text-sm mt-2">
                Go to{" "}
                <a href="/admin/settings" className="underline text-primary">
                  Admin → Settings
                </a>{" "}
                and save your Whop API Key and Company ID.
              </p>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => fetchBalance()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { ledger, withdrawals, fetchedAt } = data
  const usdBalance = ledger.balances.find((b) => b.currency === "usd") ?? ledger.balances[0]
  const currency = usdBalance?.currency ?? "usd"
  const availableBalance = usdBalance?.balance ?? 0
  const pendingBalance = usdBalance?.pending_balance ?? 0
  const reserveBalance = usdBalance?.reserve_balance ?? 0
  const verification = ledger.payout_account_details?.latest_verification

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Whop Balance</h1>
          <p className="text-muted-foreground mt-1">
            Live balance synced from Whop · Last updated {fmtUtc(fetchedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchBalance(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
          <a
            href={`https://whop.com/dashboard/${ledger.owner.id}/balances`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Whop
            </Button>
          </a>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        {/* Available */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-50" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400">
                {fmt(availableBalance, currency)}
              </p>
              <p className="text-xs text-muted-foreground">Ready to withdraw</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent opacity-50" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pending Balance</p>
              <p className="text-3xl font-semibold tracking-tight text-amber-600 dark:text-amber-400">
                {fmt(pendingBalance, currency)}
              </p>
              <p className="text-xs text-muted-foreground">Processing / clearing</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Reserve */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-50" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Reserve Balance</p>
              <p className="text-3xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">
                {fmt(reserveBalance, currency)}
              </p>
              <p className="text-xs text-muted-foreground">Held by Whop</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Account Details + Status */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Account Info */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Account Details
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{ledger.owner.name ?? ledger.owner.username}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Ledger ID</span>
              <span className="font-mono text-xs">{ledger.id}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Ledger Type</span>
              <Badge variant="secondary" className="capitalize">{ledger.ledger_type}</Badge>
            </div>
            {ledger.transfer_fee !== null && (
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Transfer Fee</span>
                <span>{ledger.transfer_fee}%</span>
              </div>
            )}
            {ledger.payout_account_details?.email && (
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Payout Email</span>
                <span>{ledger.payout_account_details.email}</span>
              </div>
            )}
            {ledger.payout_account_details?.business_name && (
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Business Name</span>
                <span>{ledger.payout_account_details.business_name}</span>
              </div>
            )}
            {verification && (
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Verification</span>
                <VerificationBadge status={verification.status} />
              </div>
            )}
            {ledger.payments_approval_status && (
              <div className="flex justify-between items-center py-1.5">
                <span className="text-muted-foreground">Payments Status</span>
                <Badge
                  className={
                    ledger.payments_approval_status === "approved"
                      ? "bg-green-500/15 text-green-600 border-green-500/20 hover:bg-green-500/15"
                      : "bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/15"
                  }
                >
                  {ledger.payments_approval_status}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* All balances (multi-currency) */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              All Currency Balances
            </h2>
          </div>
          {ledger.balances.length === 0 ? (
            <p className="text-sm text-muted-foreground">No balance data available.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border/30">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-muted/30">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Currency</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Available</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Pending</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Reserve</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.balances.map((b) => (
                    <tr key={b.currency} className="border-b border-border/20 last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold uppercase">{b.currency}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-green-600 dark:text-green-400">
                        {fmt(b.balance, b.currency)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-amber-600 dark:text-amber-400">
                        {fmt(b.pending_balance, b.currency)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-blue-600 dark:text-blue-400">
                        {fmt(b.reserve_balance, b.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recent Withdrawals
          </h2>
          <Badge variant="secondary" className="text-xs ml-auto">
            Last 20
          </Badge>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
            No withdrawals found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Method</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Requested</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Completed</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{w.id}</td>
                    <td className="px-4 py-2.5 font-semibold">{fmt(w.amount, w.currency)}</td>
                    <td className="px-4 py-2.5"><WithdrawalStatusBadge status={w.status} /></td>
                    <td className="px-4 py-2.5 text-muted-foreground capitalize">
                      {w.payout_method?.type ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {fmtUtc(w.created_at)}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {w.completed_at ? fmtUtc(w.completed_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
