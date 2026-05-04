import { logger } from "@/lib/logger";
import Redis from "ioredis";

/**
 * Enterprise Feature Flag Manager (Graceful Degradation)
 * Allows turning off heavy or non-critical features (like recommended items, PDF generation) 
 * instantly without deployment during an incident.
 */
class FeatureFlagManager {
    private cache = new Map<string, boolean>();
    private redis: Redis | null = null;
    private lastFetchTime = 0;
    private readonly TTL_MS = 30000; // Cache for 30s to avoid hitting Redis per request

    constructor() {
        if (process.env.REDIS_URL) {
            this.redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 });
        }
    }

    async isEnabled(flagName: string, fallback = true): Promise<boolean> {
        const now = Date.now();
        if (now - this.lastFetchTime < this.TTL_MS && this.cache.has(flagName)) {
            return this.cache.get(flagName)!;
        }

        if (this.redis) {
            try {
                const val = await this.redis.get(`flag:${flagName}`);
                if (val !== null) {
                    const isEnabled = val === "true";
                    this.cache.set(flagName, isEnabled);
                    this.lastFetchTime = now;
                    return isEnabled;
                }
            } catch (err) {
                logger.warn({ message: `Failed to fetch flag ${flagName} from Redis, using fallback` });
            }
        }

        // If Redis fails or flag doesn't exist, use safe fallback
        this.cache.set(flagName, fallback);
        return fallback;
    }
}

export const flags = new FeatureFlagManager();
