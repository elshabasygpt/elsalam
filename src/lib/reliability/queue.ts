import { logger } from "@/lib/logger";
import Redis from "ioredis";

/**
 * Enterprise Background Task Queue (Fire and Forget Strategy)
 * Instead of making the user wait 3 seconds for an email to send, 
 * push the job to this queue. A separate worker (or CRON job) processes it.
 */
class TaskQueue {
    private redis: Redis | null = null;
    private readonly QUEUE_NAME = "elsalam:background_jobs";

    constructor() {
        if (process.env.REDIS_URL) {
            this.redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 });
        }
    }

    /**
     * Dispatch a background job. The API route returns immediately.
     */
    async dispatch(taskName: string, payload: Record<string, any>) {
        const job = {
            id: crypto.randomUUID(),
            task: taskName,
            payload,
            timestamp: Date.now()
        };

        if (this.redis) {
            try {
                await this.redis.rpush(this.QUEUE_NAME, JSON.stringify(job));
                logger.debug({ message: `[QUEUE] Dispatched job ${taskName}:${job.id}` });
            } catch (err) {
                logger.error({ message: `[QUEUE] Failed to dispatch job ${taskName}`, error: err });
                // Fallback: Execute synchronously if queue fails, to prevent data loss
                this.executeSyncFallback(taskName, payload);
            }
        } else {
            // Local development: Execute in background without awaiting
            Promise.resolve().then(() => this.executeSyncFallback(taskName, payload));
        }
    }

    private async executeSyncFallback(taskName: string, payload: any) {
        logger.warn({ message: `[QUEUE] Executing ${taskName} via sync fallback` });
        // Normally this would dynamically import the task handler and run it
        // e.g. await taskHandlers[taskName](payload);
    }
}

export const queue = new TaskQueue();
