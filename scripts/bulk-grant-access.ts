// BULK ACCESS GRANT - WHOP CUSTOMERS
// Usage: bun tsx scripts/bulk-grant-access.ts

import { prisma } from "../lib/db/prisma"

async function bulkGrantAccess() {
  console.log("=".repeat(80))
  console.log("BULK ACCESS GRANT - WHOP CUSTOMERS")
  console.log("=".repeat(80))
  console.log("")

  // Whop customers from CSV
  const usersToGrant = [
    // Customer 1: George — Paid $507.27 for Landing Page CRO Boost
    {
      email: "ar3636998@yahoo.com",
      productSlug: "landing-page-cro-boost",
      accessType: "LIFETIME" as const,
    },
    // Customer 2: George Peppas — Paid $500.00 for Shopify Speed Surge
    {
      email: "georgepeppas172@gmail.com",
      productSlug: "shopify-speed-surge",
      accessType: "LIFETIME" as const,
    },
    // Customer 3: Azaan Ali — REFUNDED $157.50 + $29 dispute alert fee
    // DO NOT GRANT ACCESS
  ]

  console.log(`Processing ${usersToGrant.length} user(s)...`)
  console.log("")

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const grant of usersToGrant) {
    console.log("-".repeat(80))
    console.log(`Processing: ${grant.email} -> ${grant.productSlug}`)
    console.log("")

    try {
      // Find product
      const product = await prisma.product.findUnique({
        where: { slug: grant.productSlug },
      })

      if (!product) {
        console.error(`  ERROR: Product not found: ${grant.productSlug}`)
        errorCount++
        console.log("")
        continue
      }
      console.log(`  Product found: ${product.name}`)

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: grant.email.toLowerCase().trim() },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: grant.email.toLowerCase().trim(),
            name: grant.email.split("@")[0],
            role: "CUSTOMER",
            emailVerified: new Date(),
          },
        })
        console.log(`  Created new user: ${user.email}`)
      } else {
        console.log(`  User exists: ${user.email}`)
      }

      // Check if access already exists
      const existingAccess = await prisma.productAccess.findFirst({
        where: {
          userId: user.id,
          productId: product.id,
        },
      })

      if (existingAccess) {
        console.log(`  Access already exists (status: ${existingAccess.status})`)
        console.log(`  Skipping...`)
        skipCount++
        console.log("")
        continue
      }

      // Grant access
      const access = await prisma.productAccess.create({
        data: {
          userId: user.id,
          productId: product.id,
          status: "ACTIVE",
          accessType: grant.accessType,
          expiresAt: null,
        },
      })

      console.log(`  Access granted!`)
      console.log(`     Type: ${access.accessType}`)
      console.log(`     Expires: Never (Lifetime)`)
      console.log(
        `     Access URL: https://codecraft.techsci.xyz/dashboard/products/${product.slug}`
      )

      successCount++
      console.log("")
    } catch (error) {
      console.error(
        `  ERROR: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      errorCount++
      console.log("")
    }
  }

  console.log("=".repeat(80))
  console.log("BULK ACCESS GRANT - COMPLETE")
  console.log("=".repeat(80))
  console.log("")
  console.log(`Successfully granted: ${successCount}`)
  console.log(`Skipped (already exists): ${skipCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log("")
  console.log("NEXT STEPS:")
  console.log("")
  console.log("1. Verify George:")
  console.log(
    "   bun tsx scripts/verify-access.ts ar3636998@yahoo.com landing-page-cro-boost"
  )
  console.log("")
  console.log("2. Verify George Peppas:")
  console.log(
    "   bun tsx scripts/verify-access.ts georgepeppas172@gmail.com shopify-speed-surge"
  )
  console.log("")
  console.log("3. Check Azaan Ali (should have NO access):")
  console.log(
    "   bun tsx scripts/verify-access.ts axaanali6@gmail.com realestate-ai-video-review"
  )
  console.log("")
}

bulkGrantAccess().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
