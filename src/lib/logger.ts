type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogInput {
    message: string;
    traceId?: string; // Standardized from requestId
    spanId?: string;  // Unique ID for a specific operation within a trace
    route?: string;
    method?: string;
    userId?: string;
    durationMs?: number;
    statusCode?: number;
    errorStack?: string;
    [key: string]: any;
}

interface LogPayload extends LogInput {
    level: LogLevel;
}

class Logger {
    // 10% sampling rate for INFO/DEBUG logs in Production to save costs
    private readonly SAMPLE_RATE = process.env.NODE_ENV === "production" ? 0.1 : 1.0;

    private shouldSample(level: LogLevel): boolean {
        if (level === "ERROR" || level === "WARN") return true; // Never sample errors
        return Math.random() <= this.SAMPLE_RATE;
    }

    private formatLog(payload: LogPayload) {
        const logData = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "development",
            ...payload,
        };

        if (process.env.NODE_ENV === "production") {
            // Enterprise JSON stringified for Datadog / ELK / CloudWatch
            return JSON.stringify(logData);
        } else {
            // Pretty print for local development
            const color = payload.level === "ERROR" ? "\x1b[31m" : payload.level === "WARN" ? "\x1b[33m" : "\x1b[32m";
            const reset = "\x1b[0m";
            const traceDetails = `[Trace:${payload.traceId?.substring(0, 8) || "SYS"}|Span:${payload.spanId?.substring(0, 8) || "-"}]`;
            return `${color}[${payload.level}]${reset} ${traceDetails} [${payload.route || "SYS"}] ${payload.message} ${payload.durationMs ? `(${payload.durationMs}ms)` : ""}`;
        }
    }

    info(payload: LogInput) {
        if (this.shouldSample("INFO")) {
            console.log(this.formatLog({ ...payload, level: "INFO" }));
        }
    }

    warn(payload: LogInput) {
        console.warn(this.formatLog({ ...payload, level: "WARN" }));
    }

    error(payload: LogInput) {
        console.error(this.formatLog({ ...payload, level: "ERROR" }));
    }

    debug(payload: LogInput) {
        if (process.env.NODE_ENV === "development" && this.shouldSample("DEBUG")) {
            console.debug(this.formatLog({ ...payload, level: "DEBUG" }));
        }
    }
}

export const logger = new Logger();
