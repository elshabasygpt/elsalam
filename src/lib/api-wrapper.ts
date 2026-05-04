import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";
import { handleApiError } from "./error-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { metrics } from "./observability/metrics";

type ApiHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function withMonitoring(handler: ApiHandler, routeName: string): ApiHandler {
    return async (req: NextRequest, ctx: any) => {
        const startMs = Date.now();
        const traceId = req.headers.get("x-request-id") || crypto.randomUUID();
        const spanId = crypto.randomUUID().substring(0, 8); // Unique span for this route execution
        const method = req.method;
        
        let userId = "UNAUTHENTICATED";
        try {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) userId = session.user.id;
        } catch { /* ignore */ }

        // Record incoming request metric
        metrics.increment("http_requests_total", { method, route: routeName });

        try {
            const response = await handler(req, ctx);
            
            const durationMs = Date.now() - startMs;
            const statusCode = response.status;

            // 1. Success Logging (INFO) with Sample Rate
            logger.info({
                message: `Request completed`,
                route: routeName,
                method,
                traceId,
                spanId,
                userId,
                statusCode,
                durationMs,
            });

            // 2. Metrics Recording
            metrics.observe("http_request_duration_ms", durationMs, { method, route: routeName, status: statusCode.toString() });
            
            // 3. Alerts integration (Slow responses)
            if (durationMs > 2000) {
                logger.warn({
                    message: `[ALERT] Slow Response Detected (>2s)`,
                    route: routeName,
                    method,
                    traceId,
                    spanId,
                    userId,
                    statusCode,
                    durationMs,
                });
            }

            return response;
        } catch (error: any) {
            const durationMs = Date.now() - startMs;
            
            // Record failure metric
            metrics.increment("http_errors_total", { method, route: routeName, type: error.name || "Unknown" });
            metrics.observe("http_request_duration_ms", durationMs, { method, route: routeName, status: "500" });

            // 2. Error Logging is delegated to handleApiError, but we record the span failure here
            logger.error({
                message: `Request failed`,
                route: routeName,
                method,
                traceId,
                spanId,
                userId,
                durationMs,
                errorStack: error.stack,
            });

            return handleApiError(error, routeName);
        }
    };
}
