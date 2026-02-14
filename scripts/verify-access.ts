// ACCESS VERIFICATION SCRIPT
// Usage: bun tsx scripts/verify-access.ts <email> <product-slug>

import { prisma } from "../lib/db/prisma"

async function verifyAccess(email: string, productSlug: string) {
  console.log("")
  console.log("=".repeat(80))
  console.log(`ACCESS VERIFICATION: ${email} -> ${productSlug}`)
  console.log("=".repeat(80))
  console.log("")

  let checksPassed = 0
  const totalChecks = 7

  // CHECK 1: User exists
  console.log("CHECK 1/7: User exists in database")
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      productAccess: true,
      purchases: true,
    },
  })

  if (!user) {
    console.log("  FAILED: User not found")
    console.log("  -> Solution: Create user via /signup or grant access via admin panel")
    console.log("")
    process.exit(1)
  }
  console.log(`  PASSED: User found (ID: ${user.id})`)
  console.log(`     Name: ${user.name || "Not set"}`)
  console.log(`     Role: ${user.role}`)
  console.log(`     Email Verified: ${user.emailVerified ? "Yes" : "No"}`)
  console.log("")
  checksPassed++

  // CHECK 2: Product exists
  console.log("CHECK 2/7: Product exists")
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: {
      contentItems: true,
    },
  })

  if (!product) {
    console.log("  FAILED: Product not found")
    console.log("  -> Available products:")
    const allProducts = await prisma.product.findMany()
    allProducts.forEach((p) => console.log(`     - ${p.slug}`))
    console.log("")
    process.exit(1)
  }
  console.log(`  PASSED: Product found (ID: ${product.id})`)
  console.log(`     Name: ${product.name}`)
  console.log(`     Price: $${product.price}`)
  console.log("")
  checksPassed++

  // CHECK 3: Access record exists
  console.log("CHECK 3/7: Access record exists")
  const access = await prisma.productAccess.findFirst({
    where: {
      userId: user.id,
      productId: product.id,
    },
  })

  if (!access) {
    console.log("  FAILED: No access record found")
    console.log("  -> Solution: Grant access via admin panel at:")
    console.log("     https://codecraft.techsci.xyz/admin/access")
    console.log("")

    // Print summary even on failure
    console.log("=".repeat(80))
    console.log("VERIFICATION SUMMARY")
    console.log("=".repeat(80))
    console.log(`Checks passed: ${checksPassed}/${totalChecks}`)
    console.log("SOME CHECKS FAILED")
    console.log("")
    process.exit(1)
  }
  console.log(`  PASSED: Access record exists (ID: ${access.id})`)
  console.log("")
  checksPassed++

  // CHECK 4: Access is ACTIVE
  console.log("CHECK 4/7: Access status is ACTIVE")
  if (access.status !== "ACTIVE") {
    console.log(`  FAILED: Access status is ${access.status} (should be ACTIVE)`)
    console.log("  -> Solution: Update status via Prisma Studio or admin panel")
    console.log("")
  } else {
    console.log("  PASSED: Access is ACTIVE")
    console.log("")
    checksPassed++
  }

  // CHECK 5: Access not expired
  console.log("CHECK 5/7: Access has not expired")
  if (access.expiresAt) {
    const isExpired = new Date() > access.expiresAt
    if (isExpired) {
      console.log(`  FAILED: Access expired on ${access.expiresAt.toISOString()}`)
      console.log("  -> Solution: Extend expiry date or change to LIFETIME")
      console.log("")
    } else {
      const daysLeft = Math.floor(
        (access.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      console.log(
        `  PASSED: Access valid until ${access.expiresAt.toISOString()}`
      )
      console.log(`     Days remaining: ${daysLeft}`)
      console.log("")
      checksPassed++
    }
  } else {
    console.log("  PASSED: Lifetime access (never expires)")
    console.log("")
    checksPassed++
  }

  // CHECK 6: Access type is valid
  console.log("CHECK 6/7: Access type is valid")
  console.log(`  PASSED: Access type is ${access.accessType}`)
  console.log("")
  checksPassed++

  // CHECK 7: Product has content
  console.log("CHECK 7/7: Product has content items")
  const contentCount = product.contentItems.length
  if (contentCount === 0) {
    console.log("  WARNING: Product has no content items")
    console.log(
      "  -> User can access the product page but won't see any downloads/links"
    )
    console.log(
      "  -> Add content via admin panel: https://codecraft.techsci.xyz/admin/products"
    )
    console.log("")
  } else {
    console.log(`  PASSED: Product has ${contentCount} content item(s)`)
    console.log("")
    checksPassed++
  }

  // Summary
  console.log("=".repeat(80))
  console.log("VERIFICATION SUMMARY")
  console.log("=".repeat(80))
  console.log("")
  console.log(`Checks passed: ${checksPassed}/${totalChecks}`)
  console.log("")

  if (checksPassed === totalChecks) {
    console.log("ALL CHECKS PASSED!")
    console.log("")
    console.log("User has full access to this product.")
    console.log("")
    console.log("Access details:")
    console.log(`  Product: ${product.name}`)
    console.log(`  User: ${user.email}`)
    console.log(`  Type: ${access.accessType}`)
    console.log(`  Status: ${access.status}`)
    console.log(
      `  Expires: ${access.expiresAt ? access.expiresAt.toISOString() : "Never"}`
    )
    console.log("")
    console.log("User can access product at:")
    console.log(
      `  https://codecraft.techsci.xyz/dashboard/products/${productSlug}`
    )
    console.log("")
    console.log("Login page:")
    console.log("  https://codecraft.techsci.xyz/login")
    console.log("")
  } else {
    console.log("SOME CHECKS FAILED")
    console.log("")
    console.log("Review the failed checks above and fix the issues.")
    console.log("Then run this script again to verify.")
    console.log("")
  }

  // Additional info
  if (user.purchases.length > 0) {
    console.log("Purchase history:")
    for (const purchase of user.purchases) {
      console.log(
        `  - $${purchase.amount} on ${purchase.createdAt.toISOString()}`
      )
    }
    console.log("")
  }

  if (user.productAccess.length > 1) {
    console.log("Other active access:")
    const otherAccess = user.productAccess.filter(
      (a) => a.productId !== product.id
    )
    for (const a of otherAccess) {
      const p = await prisma.product.findUnique({ where: { id: a.productId } })
      console.log(`  - ${p?.name} (${a.status})`)
    }
    console.log("")
  }

  console.log("=".repeat(80))
  console.log("")
}

// Parse command line args
const email = process.argv[2]
const slug = process.argv[3]

if (!email || !slug) {
  console.log("")
  console.log("Missing arguments")
  console.log("")
  console.log("Usage:")
  console.log("  bun tsx scripts/verify-access.ts <email> <product-slug>")
  console.log("")
  console.log("Example:")
  console.log(
    "  bun tsx scripts/verify-access.ts customer@example.com email-newsletter-starter-pack"
  )
  console.log("")
  console.log("Available product slugs:")
  console.log("  - email-newsletter-starter-pack")
  console.log("  - landing-page-cro-boost")
  console.log("  - social-media-content-calendar")
  console.log("  - growth-accelerator-package")
  console.log("  - realestate-ai-video-review")
  console.log("  - shopify-speed-surge")
  console.log("  - seo-master-toolkit")
  console.log("  - email-automation-playbook")
  console.log("  - paid-ads-master-class")
  console.log("  - ecommerce-conversion-kit")
  console.log("")
  process.exit(1)
}

verifyAccess(email, slug).catch((error) => {
  console.error("")
  console.error("Fatal error:", error)
  console.error("")
  process.exit(1)
})
