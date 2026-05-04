import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * Enterprise Transaction Manager with Timeout and Outbox Pattern
 * Prevents Dual-Writes and Transaction Timeouts under extreme load.
 */
export class TransactionManager {
    
    /**
     * Wraps a transaction with safe timeouts.
     * Use this instead of prisma.$transaction for financial operations.
     */
    static async executeWithTimeout<T>(
        operation: (tx: any) => Promise<T>,
        timeoutMs = 15000 // 15 seconds max execution
    ): Promise<T> {
        return prisma.$transaction(async (tx) => {
            return await operation(tx);
        }, {
            maxWait: 5000,   // Wait max 5s for a connection from the pool
            timeout: timeoutMs // Abort if query takes > 15s
        });
    }

    /**
     * Publishes an event to the Outbox table safely INSIDE a transaction.
     * Prevents the Dual-Write Problem. The event is only committed if the transaction succeeds.
     */
    static async publishEvent(tx: any, type: string, payload: any) {
        await tx.outboxEvent.create({
            data: {
                type,
                payload: JSON.stringify(payload),
                status: "PENDING"
            }
        });
        logger.debug({ message: `[OUTBOX] Event ${type} staged for async processing` });
    }
}
