import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaForAuth: PrismaClient | undefined;
};

// Parse DATABASE_URL to extract connection details
const dbUrl = new URL(process.env.DATABASE_URL!);

const dbConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
};

// Prisma 7 requires adapter for MySQL connections.
// Each client gets its own adapter so their pools are independent.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaMariaDb({ ...dbConfig, connectionLimit: 10 }),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Separate client for NextAuth (needs its own pool to avoid build-time contention)
export const prismaForAuth =
  globalForPrisma.prismaForAuth ??
  new PrismaClient({
    adapter: new PrismaMariaDb({ ...dbConfig, connectionLimit: 5 }),
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
