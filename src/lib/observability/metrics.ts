import Redis from "ioredis";
import { logger } from "@/lib/logger";

export class MetricsRegistry {
    private redis: Redis | null = null;
    
    // In-memory fallback
    private counters: Record<string, number> = {};
    private histograms: Record<string, number[]> = {};

    // Batching queues for Redis
    private counterQueue: Record<string, number> = {};
    private histogramQueue: Record<string, number[]> = {};
    private flushInterval: NodeJS.Timeout;

    constructor() {
        if (process.env.REDIS_URL) {
            this.redis = new Redis(process.env.REDIS_URL, {
                maxRetriesPerRequest: 1,
                retryStrategy: () => null // Don't block if Redis goes down
            });
            this.redis.on('error', (err) => logger.warn({ message: "Redis connection error for metrics", error: err.message }));
        }

        // Flush metrics to Redis every 10 seconds to reduce network calls (Batching)
        this.flushInterval = setInterval(() => this.flush(), 10000);
    }

    increment(metricName: string, tags: Record<string, string> = {}, value: number = 1) {
        const key = this.buildKey(metricName, tags);
        if (this.redis) {
            this.counterQueue[key] = (this.counterQueue[key] || 0) + value;
        } else {
            this.counters[key] = (this.counters[key] || 0) + value;
        }
    }

    observe(metricName: string, value: number, tags: Record<string, string> = {}) {
        const key = this.buildKey(metricName, tags);
        if (this.redis) {
            if (!this.histogramQueue[key]) this.histogramQueue[key] = [];
            this.histogramQueue[key].push(value);
        } else {
            if (!this.histograms[key]) this.histograms[key] = [];
            this.histograms[key].push(value);
            if (this.histograms[key].length > 100) this.histograms[key].shift();
        }
    }

    private async flush() {
        if (!this.redis) return;

        const pipeline = this.redis.pipeline();
        
        // Flush Counters
        for (const [key, value] of Object.entries(this.counterQueue)) {
            if (value > 0) {
                pipeline.incrby(`metrics:${key}`, value);
                this.counterQueue[key] = 0; // reset
            }
        }

        // Flush Histograms
        for (const [key, values] of Object.entries(this.histogramQueue)) {
            if (values.length > 0) {
                // Store recent observations in a Redis List (capped at 100)
                pipeline.lpush(`metrics:${key}:obs`, ...values);
                pipeline.ltrim(`metrics:${key}:obs`, 0, 99); 
                this.histogramQueue[key] = []; // reset
            }
        }

        try {
            await pipeline.exec();
        } catch (error) {
            logger.warn({ message: "Failed to flush metrics to Redis", error });
        }
    }

    // Export metrics in Prometheus Format
    async exportPrometheusFormat(): Promise<string> {
        let output = "";

        if (this.redis) {
            // Read from Redis
            const keys = await this.redis.keys("metrics:*");
            for (const key of keys) {
                const stripped = this.stripTags(key.replace("metrics:", ""));
                if (key.endsWith(":obs")) {
                    const values = await this.redis.lrange(key, 0, -1);
                    const numValues = values.map(Number);
                    const count = numValues.length;
                    const sum = numValues.reduce((a, b) => a + b, 0);
                    const avg = count > 0 ? sum / count : 0;
                    output += `# TYPE ${stripped} summary\n`;
                    output += `${stripped}_count${this.extractTags(key)} ${count}\n`;
                    output += `${stripped}_sum${this.extractTags(key)} ${sum}\n`;
                    output += `${stripped}_avg${this.extractTags(key)} ${avg}\n`;
                } else {
                    const value = await this.redis.get(key);
                    output += `# TYPE ${stripped} counter\n`;
                    output += `${stripped}${this.extractTags(key)} ${value}\n`;
                }
            }
        } else {
            // Read from Memory Fallback
            for (const [key, value] of Object.entries(this.counters)) {
                output += `# TYPE ${this.stripTags(key)} counter\n`;
                output += `${key} ${value}\n`;
            }
            for (const [key, values] of Object.entries(this.histograms)) {
                const count = values.length;
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = count > 0 ? sum / count : 0;
                const stripped = this.stripTags(key);
                output += `# TYPE ${stripped} summary\n`;
                output += `${stripped}_count${this.extractTags(key)} ${count}\n`;
                output += `${stripped}_sum${this.extractTags(key)} ${sum}\n`;
                output += `${stripped}_avg${this.extractTags(key)} ${avg}\n`;
            }
        }

        return output;
    }

    private buildKey(name: string, tags: Record<string, string>): string {
        if (Object.keys(tags).length === 0) return name;
        const tagString = Object.entries(tags)
            .map(([k, v]) => `${k}="${v}"`)
            .join(",");
        return `${name}{${tagString}}`;
    }

    private stripTags(key: string): string {
        return key.split("{")[0];
    }

    private extractTags(key: string): string {
        const parts = key.split("{");
        return parts.length > 1 ? `{${parts[1]}`.replace(":obs", "") : "";
    }
}

export const metrics = new MetricsRegistry();


