import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Here you can add custom logic if needed after auth
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths inside /admin and /api/admin
         * Except for /admin/login
         */
        "/((?!admin/login)admin/.*)",
        "/api/admin/:path*",
    ],
};
