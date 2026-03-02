import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { UserRole } from "@prisma/client"
import { getWhopApiKey, getWhopCompanyId } from "@/lib/settings"
import * as Sentry from "@sentry/nextjs"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [apiKey, companyId] = await Promise.all([
      getWhopApiKey(),
      getWhopCompanyId(),
    ])

    if (!apiKey) {
      return NextResponse.json(
        { error: "Whop API key not configured. Add it in Admin → Settings." },
        { status: 503 }
      )
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Whop Company ID not configured. Add it in Admin → Settings." },
        { status: 503 }
      )
    }

    // Fetch ledger account balance using company ID
    // GET https://api.whop.com/api/v1/ledger_accounts/{company_id}
    const balanceRes = await fetch(
      `https://api.whop.com/api/v1/ledger_accounts/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        // No cache — always fresh
        cache: "no-store",
      }
    )

    if (!balanceRes.ok) {
      const errText = await balanceRes.text()
      Sentry.captureMessage("Whop balance API error", {
        extra: { status: balanceRes.status, body: errText },
        tags: { route: "GET /api/admin/whop-balance" },
      })
      return NextResponse.json(
        { error: `Whop API error: ${balanceRes.status} ${balanceRes.statusText}` },
        { status: balanceRes.status }
      )
    }

    const ledger = await balanceRes.json()

    // Fetch withdrawal history
    const withdrawalsRes = await fetch(
      `https://api.whop.com/api/v1/withdrawals?company_id=${companyId}&per=20`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    const withdrawals = withdrawalsRes.ok ? await withdrawalsRes.json() : { data: [] }

    return NextResponse.json({
      ledger,
      withdrawals: withdrawals.data ?? [],
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "GET /api/admin/whop-balance", method: "GET" },
    })
    return NextResponse.json(
      { error: "Failed to fetch Whop balance" },
      { status: 500 }
    )
  }
}
