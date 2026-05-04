import { logger } from "@/lib/logger";

/**
 * Chaos Monkey Middleware
 * Designed to intentionally inject failures in staging/testing environments
 * to ensure circuit breakers, load shedders, and retries work as expected.
 * NEVER RUN IN PRODUCTION.
 */
export class ChaosMonkey {
    private readonly IS_STAGING = process.env.NODE_ENV !== "production" && process.env.ENABLE_CHAOS === "true";

    async injectChaos() {
        if (!this.IS_STAGING) return;

        const rand = Math.random();

        // 1. 5% chance of simulating a DB/Network delay (2-5 seconds)
        if (rand < 0.05) {
            const delay = Math.floor(Math.random() * 3000) + 2000;
            logger.warn({ message: `[CHAOS MONKEY] Injecting ${delay}ms latency spike` });
            await new Promise(res => setTimeout(res, delay));
        }
        
        // 2. 2% chance of throwing a random 500 error
        else if (rand < 0.07) {
            logger.error({ message: `[CHAOS MONKEY] Injecting random 500 API failure` });
            throw new Error("ChaosMonkey: Simulated Internal Server Error");
        }

        // 3. 1% chance of simulating Memory Pressure (OOM scenario)
        else if (rand < 0.08) {
            logger.warn({ message: `[CHAOS MONKEY] Injecting memory pressure spike` });
            const arr = new Array(10000000).fill("CHAOS"); // Temporarily consume memory
            setTimeout(() => { arr.length = 0; }, 2000); // Free it after 2s
        }
    }
}

export const chaosMonkey = new ChaosMonkey();
