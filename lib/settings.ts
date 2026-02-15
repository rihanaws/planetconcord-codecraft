/**
 * App settings helper — reads from AppSetting table with env var fallback
 * Uses in-memory TTL cache (60s) to avoid DB call on every webhook
 */

import { prisma } from "@/lib/db/prisma"

let cachedSettings: Record<string, string> | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60_000 // 60 seconds

async function loadSettings(): Promise<Record<string, string>> {
  const now = Date.now()
  if (cachedSettings && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSettings
  }

  try {
    const rows = await prisma.appSetting.findMany()
    const map: Record<string, string> = {}
    for (const row of rows) {
      map[row.key] = row.value
    }
    cachedSettings = map
    cacheTimestamp = now
    return map
  } catch {
    // If DB fails, return empty map — env vars will be used as fallback
    return cachedSettings || {}
  }
}

/**
 * Get Whop webhook secret — DB first, then env var fallback
 */
export async function getWhopWebhookSecret(): Promise<string | undefined> {
  const settings = await loadSettings()
  return settings["whop_webhook_secret"] || process.env.WHOP_WEBHOOK_SECRET
}

/**
 * Get Whop API key — DB first, then env var fallback
 */
export async function getWhopApiKey(): Promise<string | undefined> {
  const settings = await loadSettings()
  return settings["whop_api_key"] || process.env.WHOP_API_KEY
}

/**
 * Get Whop company ID — DB first, then env var fallback
 */
export async function getWhopCompanyId(): Promise<string | undefined> {
  const settings = await loadSettings()
  return settings["whop_company_id"] || process.env.WHOP_COMPANY_ID
}
