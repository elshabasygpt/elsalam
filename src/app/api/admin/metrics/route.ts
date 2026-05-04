import { NextResponse } from "next/server";
import { metrics } from "@/lib/observability/metrics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    // Basic protection to ensure only admins/Prometheus scrape this
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Export in official Prometheus format
    const promFormat = metrics.exportPrometheusFormat();

    return new NextResponse(promFormat, {
        headers: {
            "Content-Type": "text/plain; version=0.0.4",
        },
    });
}
