export class DomainError extends Error {
    constructor(message: string, public statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends DomainError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends DomainError {
    constructor(message: string = "Validation failed") {
        super(message, 400);
    }
}
