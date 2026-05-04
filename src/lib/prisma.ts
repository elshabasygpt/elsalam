import { PrismaClient } from "@prisma/client";

/**
 * Enterprise Serverless Prisma Client Initialization
 * 
 * ⚠️ VERCEL SERVERLESS WARNING (Connection Exhaustion):
 * Each Vercel Lambda function spin-up creates a new DB connection. Under heavy B2B load,
 * this will quickly exhaust your Postgres max connections (e.g., 100 on Neon/RDS).
 * 
 * ✅ PRODUCTION SOLUTION:
 * 1. Add ?pgbouncer=true&connection_limit=1 to your DATABASE_URL in Vercel.
 * 2. Ensure your Postgres provider (Neon, Supabase, AWS RDS) has PgBouncer enabled.
 * 3. Or use Prisma Accelerate (prisma:// format URL).
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        // Ensure transactions don't hang in Serverless
        transactionOptions: {
            maxWait: 5000, // 5s max wait to acquire lock
            timeout: 10000, // 10s max execution time
        }
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
