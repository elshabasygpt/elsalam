import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "./logger";

// 1. Custom Error Classes for explicit throwing in API Routes
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public details?: any[]
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = "Bad Request", details?: any[]) { 
        super(400, "BAD_REQUEST", message, details); 
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = "Unauthorized") { 
        super(401, "UNAUTHORIZED", message); 
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = "Forbidden") { 
        super(403, "FORBIDDEN", message); 
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = "Not Found") { 
        super(404, "NOT_FOUND", message); 
    }
}

export class ConflictError extends ApiError {
    constructor(message: string = "Conflict") { 
        super(409, "CONFLICT", message); 
    }
}

// 2. The Smart Error Handler
export async function handleApiError(error: any, context?: string) {
    const headersList = await headers();
    const traceId = headersList.get("x-request-id") || "UNKNOWN";
    const route = headersList.get("x-invoke-path") || context || "UNKNOWN"; 
    
    let userId = "UNAUTHENTICATED";
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.id) userId = session.user.id;
    } catch { /* ignore */ }

    // Use unified logger
    logger.error({
        message: error?.message || "Unhandled Exception",
        route,
        traceId,
        userId,
        errorStack: error?.stack,
        errorCode: error?.code,
        errorName: error?.name
    });

    let responsePayload: any = {
        success: false,
        code: "INTERNAL_ERROR",
        message: "Internal server error. Please try again later.",
        traceId 
    };
    let statusCode = 500;

    if (error?.name === "ZodError") {
        statusCode = 400;
        responsePayload.code = "VALIDATION_ERROR";
        responsePayload.message = "Validation failed. Please check your inputs.";
        responsePayload.details = error.issues?.map((issue: any) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    else if (error instanceof ApiError) {
        statusCode = error.statusCode;
        responsePayload.code = error.code;
        responsePayload.message = error.message;
        if (error.details) responsePayload.details = error.details;
    }
    else if (error?.code === "P2002") {
        statusCode = 409;
        responsePayload.code = "CONFLICT";
        responsePayload.message = "This record already exists. (Duplicate data)";
    }
    else if (error?.code === "P2025") {
        statusCode = 404;
        responsePayload.code = "NOT_FOUND";
        responsePayload.message = "Record not found.";
    }

    return NextResponse.json(responsePayload, { status: statusCode });
}

