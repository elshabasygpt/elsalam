import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (works for single-instance; use Redis/Upstash for multi-instance prod)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
    limit: number;       // max requests
    windowMs: number;    // time window in ms
}

export function rateLimit(req: NextRequest, options: RateLimitOptions): NextResponse | null {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
        || req.headers.get("x-real-ip")
        || "unknown";

    const key = `${req.nextUrl.pathname}::${ip}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs });
        return null; // allowed
    }

    entry.count++;

    if (entry.count > options.limit) {
        return NextResponse.json(
            { success: false, message: "لقد تجاوزت الحد المسموح به. يرجى الانتظار قليلاً." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
                    "X-RateLimit-Limit": String(options.limit),
                    "X-RateLimit-Remaining": "0",
                }
            }
        );
    }

    return null; // allowed
}

// Cleanup old entries periodically to prevent memory leak
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetAt) rateLimitMap.delete(key);
    }
}, 60_000); // clean every minute
