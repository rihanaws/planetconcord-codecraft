/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { withAccelerate } from "@prisma/extension-accelerate"

const globalForPrisma = globalThis as unknown as {
  prisma: any
  prismaForAuth: any
}

// Use Prisma Accelerate if PRISMA_DATABASE_URL is set (Vercel deployments)
// Otherwise fall back to direct MySQL connection (local dev)
const useAccelerate = !!process.env.PRISMA_DATABASE_URL

let prisma: any
let prismaForAuth: any

if (useAccelerate) {
  // Accelerate connection (Vercel) — uses connection pooler
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      accelerateUrl: process.env.PRISMA_DATABASE_URL,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    }).$extends(withAccelerate())

  prismaForAuth =
    globalForPrisma.prismaForAuth ??
    new PrismaClient({
      accelerateUrl: process.env.PRISMA_DATABASE_URL,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    }).$extends(withAccelerate())
} else {
  // Direct MySQL connection (local dev) — uses MariaDB adapter
  const dbUrl = new URL(process.env.DATABASE_URL!)
  const dbConfig = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
  }

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaMariaDb({
        ...dbConfig,
        connectionLimit: 15,
        connectTimeout: 5000,
        idleTimeout: 30000,
      }),
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    })

  prismaForAuth =
    globalForPrisma.prismaForAuth ??
    new PrismaClient({
      adapter: new PrismaMariaDb({
        ...dbConfig,
        connectionLimit: 5,
        connectTimeout: 5000,
        idleTimeout: 30000,
      }),
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    })
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaForAuth = prismaForAuth
}

export { prisma, prismaForAuth }
export default prisma
