// DATABASE AUDIT SCRIPT - Run this to see all users and their access
// Usage: bun tsx scripts/audit-users-and-access.ts

import { prisma } from "../lib/db/prisma"

async function auditUsersAndAccess() {
  console.log("=".repeat(80))
  console.log("CODECRAFT DATABASE AUDIT - USERS & ACCESS")
  console.log("=".repeat(80))
  console.log("")

  // 1. Get all users
  const users = await prisma.user.findMany({
    include: {
      productAccess: {
        include: {
          product: true,
        },
      },
      purchases: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  console.log(`TOTAL USERS: ${users.length}`)
  console.log("")

  // 2. Categorize users
  const customers = users.filter((u) => u.role === "CUSTOMER")
  const admins = users.filter((u) => u.role === "ADMIN")

  console.log(`Customers: ${customers.length}`)
  console.log(`Admins: ${admins.length}`)
  console.log("")
  console.log("=".repeat(80))

  // 3. Detailed user breakdown
  for (const user of users) {
    console.log("")
    console.log("-".repeat(80))
    console.log(`USER: ${user.name || "No name"}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)
    console.log(`ID: ${user.id}`)
    console.log(`Created: ${user.createdAt.toISOString()}`)
    console.log(`Email Verified: ${user.emailVerified ? "YES" : "NO"}`)
    console.log("")

    // Product Access
    if (user.productAccess.length > 0) {
      console.log(`ACTIVE ACCESS (${user.productAccess.length}):`)
      for (const access of user.productAccess) {
        console.log(`  - ${access.product.name}`)
        console.log(`    Status: ${access.status}`)
        console.log(`    Type: ${access.accessType}`)
        if (access.expiresAt) {
          const isExpired = new Date() > access.expiresAt
          console.log(
            `    Expires: ${access.expiresAt.toISOString()} ${isExpired ? "EXPIRED" : "ACTIVE"}`
          )
        } else {
          console.log(`    Expires: Never (Lifetime)`)
        }
        if (access.whopMembershipId) {
          console.log(`    Whop Membership ID: ${access.whopMembershipId}`)
        }
        console.log("")
      }
    } else {
      console.log("NO ACTIVE ACCESS")
      console.log("")
    }

    // Purchases
    if (user.purchases.length > 0) {
      console.log(`PURCHASES (${user.purchases.length}):`)
      for (const purchase of user.purchases) {
        console.log(`  - ${purchase.product.name}`)
        console.log(`    Amount: $${purchase.amount}`)
        console.log(`    Date: ${purchase.createdAt.toISOString()}`)
        if (purchase.whopPaymentId) {
          console.log(`    Whop Payment ID: ${purchase.whopPaymentId}`)
        }
        console.log("")
      }
    } else {
      console.log("NO PURCHASES")
      console.log("")
    }
  }

  console.log("=".repeat(80))
  console.log("")

  // 4. Summary by product
  console.log("ACCESS SUMMARY BY PRODUCT:")
  console.log("")

  const products = await prisma.product.findMany({
    include: {
      productAccess: {
        where: {
          status: "ACTIVE",
        },
        include: {
          user: true,
        },
      },
    },
  })

  for (const product of products) {
    console.log(`${product.name}:`)
    console.log(`  Active Access: ${product.productAccess.length} users`)
    if (product.productAccess.length > 0) {
      console.log(`  Users:`)
      for (const access of product.productAccess) {
        console.log(`    - ${access.user.email} (${access.accessType})`)
      }
    }
    console.log("")
  }

  console.log("=".repeat(80))

  // 5. Users needing access sync
  console.log("")
  console.log("USERS WITH PURCHASES BUT NO ACCESS:")
  console.log("")

  const usersNeedingAccess = users.filter(
    (u) => u.purchases.length > 0 && u.productAccess.length === 0
  )

  if (usersNeedingAccess.length > 0) {
    for (const user of usersNeedingAccess) {
      console.log(`  ${user.email}`)
      console.log(`   Purchases: ${user.purchases.length}`)
      console.log(`   Active Access: 0`)
      console.log("")
    }
  } else {
    console.log("  All users with purchases have access")
    console.log("")
  }

  console.log("=".repeat(80))

  // 6. Expired access
  console.log("")
  console.log("EXPIRED ACCESS:")
  console.log("")

  const expiredAccess = await prisma.productAccess.findMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
      status: "ACTIVE", // Still marked as active but expired
    },
    include: {
      user: true,
      product: true,
    },
  })

  if (expiredAccess.length > 0) {
    for (const access of expiredAccess) {
      console.log(`  ${access.user.email} - ${access.product.name}`)
      console.log(`   Expired: ${access.expiresAt?.toISOString()}`)
      console.log("")
    }
  } else {
    console.log("  No expired access found")
    console.log("")
  }

  console.log("=".repeat(80))
}

auditUsersAndAccess().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
