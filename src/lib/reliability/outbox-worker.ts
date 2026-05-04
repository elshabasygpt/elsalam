import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * Enterprise Outbox Worker
 * Processes PENDING events and retries stuck PROCESSING events (Zombie Jobs).
 */
export class OutboxWorker {
    private readonly MAX_RETRIES = 3;
    // If a job is stuck in PROCESSING for more than 5 minutes, consider it a Zombie
    private readonly ZOMBIE_TIMEOUT_MINUTES = 5;

    /**
     * Call this function periodically via a Cron Job (e.g., every 1 minute)
     */
    async processQueue(batchSize = 50) {
        logger.debug({ message: "[OUTBOX_WORKER] Starting batch processing..." });

        const zombieThreshold = new Date(Date.now() - this.ZOMBIE_TIMEOUT_MINUTES * 60000);

        // Find PENDING jobs OR stuck PROCESSING jobs using Prisma (Atomic read)
        const jobs = await prisma.outboxEvent.findMany({
            where: {
                OR: [
                    { status: "PENDING" },
                    { 
                        status: "PROCESSING",
                        updatedAt: { lt: zombieThreshold } 
                    }
                ]
            },
            take: batchSize,
            orderBy: { createdAt: "asc" }
        });

        if (jobs.length === 0) return 0;

        let processedCount = 0;

        for (const job of jobs) {
            // Use Prisma's `updateMany` to ensure we are the only worker grabbing this job (Optimistic Concurrency)
            const lockResult = await prisma.outboxEvent.updateMany({
                where: {
                    id: job.id,
                    status: job.status, // Must still be the exact status we fetched
                },
                data: {
                    status: "PROCESSING",
                    updatedAt: new Date()
                }
            });

            // If 0, another worker grabbed it before us
            if (lockResult.count === 0) continue;

            try {
                const payload = JSON.parse(job.payload);
                
                // Simulate Event Execution (e.g., Dispatch Email)
                await this.executeEvent(job.type, payload);

                // Mark as processed
                await prisma.outboxEvent.update({
                    where: { id: job.id },
                    data: { status: "PROCESSED", updatedAt: new Date() }
                });

                processedCount++;
                logger.info({ message: `[OUTBOX_WORKER] Successfully processed job ${job.id}` });
            } catch (error: any) {
                logger.error({ message: `[OUTBOX_WORKER] Failed to process job ${job.id}`, errorStack: error.stack });

                // We simulate a retryCount logic by tracking it outside or relying on the DB
                // If we want actual exponential backoff, we would need a `retryCount` column in the DB.
                // Since we rely on Zombie Timeout, it will naturally be retried in 5 minutes.
                
                // Mark back as FAILED so it can be reviewed manually if it exceeds retries,
                // For now, leave it in FAILED. A separate logic should decide if it goes back to PENDING.
                await prisma.outboxEvent.update({
                    where: { id: job.id },
                    data: { status: "FAILED", updatedAt: new Date() }
                });
            }
        }

        return processedCount;
    }

    private async executeEvent(type: string, payload: any) {
        // Factory pattern to handle different event types
        switch (type) {
            case "SEND_CONFIRMATION":
                logger.info({ message: `Simulating Sending Confirmation Email`, payload });
                // await sendEmail(payload.orderId);
                break;
            default:
                throw new Error(`Unknown outbox event type: ${type}`);
        }
    }
}

export const outboxWorker = new OutboxWorker();
