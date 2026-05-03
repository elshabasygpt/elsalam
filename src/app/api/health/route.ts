import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const checks: Record<string, any> = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(2) + "s",
    };

    try {
        // DB connectivity check
        await prisma.$queryRaw`SELECT 1`;
        checks.database = "connected";
    } catch (e: any) {
        checks.database = "error: " + e.message;
        checks.status = "degraded";
    }

    const statusCode = checks.status === "ok" ? 200 : 503;
    return NextResponse.json(checks, { status: statusCode });
}
