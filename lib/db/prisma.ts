import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaForAuth: PrismaClient | undefined;
};

// Parse DATABASE_URL to extract connection details
const dbUrl = new URL(process.env.DATABASE_URL!);

// Create MariaDB adapter for Prisma 7
// Pass connection config directly instead of pool
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1), // Remove leading '/'
  connectionLimit: 5,
});

// Prisma 7 requires adapter for MySQL connections
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Separate Prisma client for NextAuth (also needs adapter for MySQL)
export const prismaForAuth =
  globalForPrisma.prismaForAuth ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaForAuth = prismaForAuth;
}

export default prisma;
