import { NextResponse } from "next/server";

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
export function handleApiError(error: any, context?: string) {
    // A. Log the raw error on the server side (Always)
    console.error(`[API ERROR] ${context ? `[${context}] ` : ""}`, error);

    // B. Handle Zod Validation Errors
    if (error?.name === "ZodError") {
        return NextResponse.json({
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed. Please check your inputs.",
            details: error.issues?.map((issue: any) => ({
                path: issue.path.join("."),
                message: issue.message,
            })),
        }, { status: 400 });
    }

    // C. Handle Custom API Errors (Thrown manually via `throw new NotFoundError()`)
    if (error instanceof ApiError) {
        return NextResponse.json({
            success: false,
            code: error.code,
            message: error.message,
            ...(error.details && { details: error.details }),
        }, { status: error.statusCode });
    }

    // D. Handle Prisma Known Errors
    if (error?.code === "P2002") { // Unique constraint failed
        return NextResponse.json({
            success: false,
            code: "CONFLICT",
            message: "This record already exists. (Duplicate data)",
        }, { status: 409 });
    }

    if (error?.code === "P2025") { // Record not found
        return NextResponse.json({
            success: false,
            code: "NOT_FOUND",
            message: "Record not found.",
        }, { status: 404 });
    }

    // E. Default Fallback (500 Internal Server Error)
    // We NEVER send `error.message` here because it might contain SQL queries or file paths
    return NextResponse.json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Internal server error. Please try again later.",
    }, { status: 500 });
}
