import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // 1. Generate Request ID
    const requestId = crypto.randomUUID();
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-request-id", requestId);

    // Create base response with new headers
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set("x-request-id", requestId);

    // 2. Auth Logic for Admin Routes
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login");
    const isAdminApiRoute = req.nextUrl.pathname.startsWith("/api/admin");

    if (isAdminRoute || isAdminApiRoute) {
        const token = await getToken({ req });
        if (!token) {
            if (isAdminApiRoute) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: response.headers });
            }
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/api/:path*", // All APIs for Request ID logging
        "/admin/:path*" // Admin pages
    ],
};
