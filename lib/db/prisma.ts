import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaForAuth: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

const prismaForAuth =
  globalForPrisma.prismaForAuth ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaForAuth = prismaForAuth
}

export { prisma, prismaForAuth }
export default prisma
