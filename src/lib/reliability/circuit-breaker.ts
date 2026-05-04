import { logger } from "@/lib/logger";

interface CircuitBreakerOptions {
    failureThreshold: number; // Number of failures before tripping
    resetTimeoutMs: number;   // How long to wait before half-open state
}

/**
 * Enterprise Circuit Breaker Pattern
 * Prevents cascading failures when a downstream dependency (DB, 3rd party API) is unresponsive.
 */
export class CircuitBreaker {
    private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
    private failureCount = 0;
    private nextAttemptTime = 0;

    constructor(
        private name: string,
        private options: CircuitBreakerOptions = { failureThreshold: 5, resetTimeoutMs: 30000 }
    ) {}

    async fire<T>(action: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
        if (this.state === "OPEN") {
            if (Date.now() > this.nextAttemptTime) {
                this.state = "HALF_OPEN";
                logger.info({ message: `Circuit ${this.name} HALF_OPEN: Testing dependency` });
            } else {
                if (fallback) {
                    logger.warn({ message: `Circuit ${this.name} OPEN: Executing fallback` });
                    return fallback();
                }
                throw new Error(`CircuitBreaker [${this.name}] is OPEN. Fast failing.`);
            }
        }

        try {
            const result = await action();
            this.onSuccess();
            return result;
        } catch (error: any) {
            this.onFailure(error);
            if (fallback) {
                logger.warn({ message: `Circuit ${this.name} FAILED: Executing fallback`, errorStack: error.stack });
                return fallback();
            }
            throw error;
        }
    }

    private onSuccess() {
        if (this.state !== "CLOSED") {
            logger.info({ message: `Circuit ${this.name} CLOSED: Recovered successfully` });
        }
        this.failureCount = 0;
        this.state = "CLOSED";
    }

    private onFailure(error: any) {
        this.failureCount++;
        if (this.failureCount >= this.options.failureThreshold) {
            this.state = "OPEN";
            this.nextAttemptTime = Date.now() + this.options.resetTimeoutMs;
            logger.error({ message: `Circuit ${this.name} TRIPPED OPEN. Blocking traffic for ${this.options.resetTimeoutMs}ms`, errorStack: error.stack });
        }
    }
}

/**
 * Enterprise Retry Wrapper with Exponential Backoff
 */
export async function withRetry<T>(
    action: () => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 500
): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await action();
        } catch (error: any) {
            attempt++;
            if (attempt >= maxRetries) throw error;
            
            // Exponential backoff + jitter to prevent thundering herd
            const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 100;
            logger.warn({ message: `Retry ${attempt}/${maxRetries} after ${Math.round(delay)}ms`, errorStack: error.message });
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error("Unreachable");
}
