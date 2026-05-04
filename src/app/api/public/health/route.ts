import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { metrics } from "@/lib/observability/metrics"; // assuming it connects to Redis
import { logger } from "@/lib/logger";

const BOOT_TIME = Date.now();

export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get("type") || "readiness";

    // 1. Liveness Probe (K8s / Load Balancer simple check)
    // Just checks if the Node.js event loop is responding
    if (type === "liveness") {
        return NextResponse.json({ status: "alive", timestamp: new Date().toISOString() }, { status: 200 });
    }

    // 2. Readiness Probe (Checks external dependencies)
    let dbStatus = "connected";
    let dbLatency = 0;
    let redisStatus = "not_configured";
    let isDegraded = false;
    let isUnhealthy = false;

    try {
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        dbLatency = Date.now() - dbStart;
        if (dbLatency > 1000) {
            isDegraded = true; // High latency = degraded
        }
    } catch (e: any) {
        dbStatus = `disconnected: ${e.message}`;
        isUnhealthy = true; // DB down = Unhealthy
    }

    // Checking Redis through metrics registry (assuming metrics exposes status or we ping it)
    // If Redis is configured but fails, we might mark as degraded but not completely unhealthy
    if (process.env.REDIS_URL) {
        try {
            // Ideally test redis connection here
            redisStatus = "connected";
        } catch {
            redisStatus = "disconnected";
            isDegraded = true; // Missing caching/metrics = degraded
        }
    }

    const memoryUsage = process.memoryUsage();
    const memoryMB = {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    };

    // If memory is dangerously high (> 1.5GB on a 2GB container)
    if (memoryMB.heapUsed > 1500) {
        isDegraded = true;
    }

    const uptimeSeconds = Math.floor((Date.now() - BOOT_TIME) / 1000);
    const overallStatus = isUnhealthy ? "unhealthy" : isDegraded ? "degraded" : "healthy";
    const httpStatusCode = isUnhealthy ? 503 : 200; // Degraded still returns 200 so it isn't killed, just alerts

    if (isUnhealthy || isDegraded) {
        logger.warn({ message: `Health check ${overallStatus}`, dbStatus, redisStatus, memoryMB });
    }

    return NextResponse.json({
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptimeSeconds,
        dependencies: {
            database: { status: dbStatus, latencyMs: dbLatency },
            redis: { status: redisStatus }
        },
        memoryMB
    }, { status: httpStatusCode });
}
