import Redis from "ioredis";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { alerts } from "@/lib/observability/alerts";

export class DistributedLock {
    private redis: Redis | null = null;
    
    private readonly UNLOCK_SCRIPT = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
    `;

    private readonly EXTEND_SCRIPT = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("expire", KEYS[1], ARGV[2])
        else
            return 0
        end
    `;

    constructor() {
        if (process.env.REDIS_URL) {
            this.redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 });
            this.redis.defineCommand("safeUnlock", { numberOfKeys: 1, lua: this.UNLOCK_SCRIPT });
            this.redis.defineCommand("safeExtend", { numberOfKeys: 1, lua: this.EXTEND_SCRIPT });
        }
    }

    async acquire(lockKey: string, ttlSeconds = 10): Promise<string | null> {
        const token = crypto.randomUUID();
        
        if (!this.redis) {
            // CRITICAL ARCHITECTURE FIX: Fail-Closed
            logger.error({ message: `[LOCK] Redis not configured. Denying lock ${lockKey}` });
            return null; 
        }

        try {
            const result = await this.redis.set(`lock:${lockKey}`, token, "EX", ttlSeconds, "NX");
            return result === "OK" ? token : null;
        } catch (error: any) {
            // CRITICAL ARCHITECTURE FIX: Visibility & Fail-Closed
            logger.error({ message: `[LOCK] Redis failure. Denying lock ${lockKey}` });
            alerts.trigger({ level: "CRITICAL", title: "Redis Lock Failure", message: `Redis distributed lock failed! System is vulnerable to race conditions. Error: ${error.message}` });
            return null; // Deny operation instead of split-brain local lock
        }
    }

    async extend(lockKey: string, token: string, extraTtlSeconds: number): Promise<boolean> {
        if (!this.redis) return false;
        
        try {
            // @ts-ignore - custom command
            const result = await this.redis.safeExtend(`lock:${lockKey}`, token, extraTtlSeconds);
            return result === 1;
        } catch (error) {
            return false;
        }
    }

    async release(lockKey: string, token: string): Promise<boolean> {
        if (!this.redis) return false;
        
        try {
            // @ts-ignore - custom command
            const result = await this.redis.safeUnlock(`lock:${lockKey}`, token);
            return result === 1;
        } catch (error) {
            return false;
        }
    }
}

export const lockManager = new DistributedLock();
