import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";
import { handleApiError, ApiError } from "./error-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { metrics } from "./observability/metrics";
import { alerts } from "./observability/alerts";
import { loadShedder } from "./reliability/load-shedder";
import { chaosMonkey } from "./reliability/chaos-monkey";

type ApiHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function withMonitoring(handler: ApiHandler, routeName: string): ApiHandler {
    return async (req: NextRequest, ctx: any) => {
        const startMs = Date.now();
        
        // Distributed Tracing (W3C standard traceparent: 00-[traceId]-[spanId]-01)
        const traceParent = req.headers.get("traceparent");
        const traceId = traceParent ? traceParent.split("-")[1] : (req.headers.get("x-request-id") || crypto.randomUUID());
        const spanId = crypto.randomUUID().substring(0, 8); 
        const method = req.method;
        
        if (loadShedder.shouldShedTraffic()) {
            metrics.increment("http_requests_shed", { method, route: routeName });
            return NextResponse.json({ 
                success: false, 
                code: "SERVICE_UNAVAILABLE", 
                message: "System under extreme load." 
            }, { status: 503, headers: { "Retry-After": "5" } });
        }

        let userId = "UNAUTHENTICATED";
        try {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) userId = session.user.id;
        } catch { /* ignore */ }

        metrics.increment("http_requests_total", { method, route: routeName });

        try {
            // Chaos Automation (Staging ONLY)
            await chaosMonkey.injectChaos();

            // Next.js Execution
            const response = await handler(req, ctx);
            const durationMs = Date.now() - startMs;
            const statusCode = response.status;

            logger.info({
                message: `Request completed`,
                route: routeName, method, traceId, spanId, userId, statusCode, durationMs,
            });

            metrics.observe("http_request_duration_ms", durationMs, { method, route: routeName, status: statusCode.toString() });
            
            if (durationMs > 2000) {
                logger.warn({ message: `Slow response detected`, route: routeName, traceId, spanId, durationMs });
                alerts.trigger({
                    level: "WARN",
                    title: "Performance Degradation",
                    message: `Route ${method} ${routeName} took ${durationMs}ms`,
                    metadata: { traceId, spanId, userId }
                });
            }

            return response;
        } catch (error: any) {
            const durationMs = Date.now() - startMs;
            
            metrics.increment("http_errors_total", { method, route: routeName, type: error.name || "Unknown" });
            metrics.observe("http_request_duration_ms", durationMs, { method, route: routeName, status: "500" });

            logger.error({
                message: `Request failed`,
                route: routeName, method, traceId, spanId, userId, durationMs, errorStack: error.stack,
            });

            alerts.trigger({
                level: "CRITICAL",
                title: "API Error Spike",
                message: `Exception in ${method} ${routeName}: ${error.message}`,
                metadata: { traceId, spanId, errorName: error.name }
            });

            return handleApiError(error, routeName);
        }
    };
}
