import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

export class PgError extends Error {
  public statusCode: number;

  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "PgError";
    Object.setPrototypeOf(this, PgError.prototype);
    this.statusCode = this.getStatusCodeFromPgError(originalError);
  }

  private getStatusCodeFromPgError(error: any): number {
    const pgErrors: Record<string, { message: string; statusCode: number }> = {
      "23505": {
        message: "Duplicate entry. This record already exists.",
        statusCode: 409,
      },
      "23502": { message: "Missing required field.", statusCode: 400 },
      "23503": {
        message: "Foreign key constraint violation. Invalid reference.",
        statusCode: 500,
      },
      "42703": {
        message: "Undefined column. Check your query.",
        statusCode: 500,
      },
      "42601": { message: "Syntax error in SQL query.", statusCode: 500 },
      "42P01": {
        message: "Undefined table. The table does not exist.",
        statusCode: 500,
      },
      "22P02": {
        message: "Invalid input syntax. Check your data types.",
        statusCode: 500,
      },
    };

    return pgErrors?.[error?.code]?.statusCode || 500;
  }

  public getResponseMessageFromPgError(error: any): string {
    const pgErrors: Record<string, { message: string; statusCode: number }> = {
      "23505": {
        message: "Duplicate entry. This record already exists.",
        statusCode: 409,
      },
      "23502": { message: "Missing required field.", statusCode: 400 },
      "23503": {
        message: "Foreign key constraint violation. Invalid reference.",
        statusCode: 500,
      },
      "42703": {
        message: "Undefined column. Check your query.",
        statusCode: 500,
      },
      "42601": { message: "Syntax error in SQL query.", statusCode: 500 },
      "42P01": {
        message: "Undefined table. The table does not exist.",
        statusCode: 500,
      },
      "22P02": {
        message: "Invalid input syntax. Check your data types.",
        statusCode: 500,
      },
    };

    return (
      pgErrors?.[error?.code]?.message ||
      this.message ||
      "Database error occurred."
    );
  }
}

export class DuplicateEntryError extends Error {
  public statusCode = 409;
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "DuplicateEntryError";
    Object.setPrototypeOf(this, DuplicateEntryError.prototype);
  }
}

export class ZodValidationError extends Error {
  public statusCode = 400;
  public formattedError: string;

  constructor(public zodError: ZodError) {
    super("Validation failed");
    this.name = "ZodValidationError";
    Object.setPrototypeOf(this, ZodValidationError.prototype);
    this.formattedError = fromError(zodError).toString();
  }
}

export class InternalServerError extends Error {
  public statusCode = 500;
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "InternalServerError";
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
