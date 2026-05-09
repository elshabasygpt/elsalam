import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple Edge In-Memory Rate Limiting (Soft Limit per Edge Isolate)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 5; // 5 requests per minute

    const record = rateLimitMap.get(ip);
    if (!record || now - record.timestamp > windowMs) {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
        return true; // Allowed
    }

    if (record.count >= maxRequests) {
        return false; // Blocked (Rate Limited)
    }

    record.count++;
    return true; // Allowed
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // 1. Generate Request ID for Tracing
    const requestId = crypto.randomUUID();
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-request-id", requestId);

    // 2. Simple Anti-Spam / Rate Limiting for Contact APIs
    if (pathname.startsWith("/api/public/contact") || pathname.startsWith("/api/contact")) {
        // Get client IP (Vercel specific header or fallback)
        const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown-ip";
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again in a minute." },
                { status: 429, headers: { "Retry-After": "60", "x-request-id": requestId } }
            );
        }
    }

    // 3. Identify Protected Routes
    const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
    const isAdminApiRoute = pathname.startsWith("/api/admin");

    // 4. RBAC (Role-Based Access Control) Logic
    if (isAdminRoute || isAdminApiRoute) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const isAuthorized = token && token.role === "ADMIN";

        if (!isAuthorized) {
            if (isAdminApiRoute) {
                return NextResponse.json(
                    { error: "Forbidden: Admin privileges required." }, 
                    { status: 403, headers: { "x-request-id": requestId } }
                );
            }
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callbackUrl", encodeURI(req.url));
            return NextResponse.redirect(loginUrl);
        }
    }

    // 5. Continue Request with Tracing Headers
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    
    // 6. Apply Strict Security Headers (OWASP Recommendations)
    response.headers.set("x-request-id", requestId);
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // Optional: Basic CSP to prevent inline execution of malicious scripts (uncomment if tested)
    // response.headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;");

    return response;
}

// 5. Matcher Configuration (Optimized)
export const config = {
    matcher: [
        /*
         * Apply to all paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, images (public files)
         */
        "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
    ],
};
