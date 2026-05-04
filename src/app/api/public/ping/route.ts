import { NextResponse } from "next/server";

/**
 * Enterprise Cold Start Mitigation (Warmer/Ping Endpoint)
 * Designed to be called by an external CRON job (e.g., UptimeRobot, Vercel Cron)
 * every 1-5 minutes to keep the Vercel Serverless Function hot.
 */
export async function GET() {
    return NextResponse.json({ 
        status: "alive", 
        timestamp: new Date().toISOString(),
        message: "Pong! Container is warm." 
    });
}
