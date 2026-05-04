import { logger } from "@/lib/logger";

/**
 * Enterprise Load Shedding (Backpressure)
 * Monitors Node.js Event Loop Lag. If the server is choking under extreme load,
 * we shed (reject) traffic to prevent a complete OOM (Out Of Memory) crash.
 */
class LoadShedder {
    private isOverloaded = false;
    private readonly MAX_LAG_MS = 200; // If event loop lags by 200ms, we are overloaded.
    private lastCheckTime = Date.now();

    constructor() {
        // Monitor event loop every 500ms
        setInterval(() => this.checkEventLoopLag(), 500).unref();
    }

    private checkEventLoopLag() {
        const now = Date.now();
        const lag = now - this.lastCheckTime - 500;
        this.lastCheckTime = now;

        if (lag > this.MAX_LAG_MS && !this.isOverloaded) {
            this.isOverloaded = true;
            logger.warn({ message: `[BACKPRESSURE] Server overloaded! Event loop lag: ${lag}ms. Shedding traffic.` });
        } else if (lag <= this.MAX_LAG_MS && this.isOverloaded) {
            this.isOverloaded = false;
            logger.info({ message: `[BACKPRESSURE] Server recovered. Event loop lag: ${lag}ms. Resuming traffic.` });
        }
    }

    public shouldShedTraffic(): boolean {
        return this.isOverloaded;
    }
}

export const loadShedder = new LoadShedder();
