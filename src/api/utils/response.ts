import type { Context } from "hono";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

type Errors = {
  [key: string]: any;
};

export const successResponse = (c: Context, data: any = {}, message = 'Success', status = 200) => {
  return c.json({
    success: true,
    message,
    data,
  }, status as any)
}

export const errorResponse = (c: Context, message = 'Something went wrong', status = 400, errorCode?: string, details: any = {}) => {
  return c.json({
    success: false,
    message,
    errorCode,
    details,
  }, status as any)
}

const handlePgError = (err: any) => {
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
    pgErrors[err.code] || {
      message: "Database error occurred.",
      statusCode: 500,
    }
  );
};

export function handleErrorResponse(error: any) {
  const errorObj = error.error;
  if (errorObj instanceof ZodError) {
    return {
      statusCode: 400,
      type: "Validation Error",
      message: "Validation Error",
      errors: fromError(errorObj).details.map((error) => error.message),
    };
  }

  if (errorObj.code) {
    const errorDetails = handlePgError(errorObj);
    return {
      statusCode: errorDetails.statusCode,
      message: "Database Error",
      type: "Database Error",
      errors: { message: errorDetails.message },
    };
  }

  return {
    statusCode: errorObj.status || 500,
    message: errorObj.message || "Internal Server Error",
    type: "Internal Server Error",
    errors: errorObj.errors || null,
  };
}
