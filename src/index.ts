import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./api/auth/auth.routes.js";
import { handleErrorResponse } from "./api/utils/response.js";
import {
  DuplicateEntryError,
  InternalServerError,
  PgError,
  ZodValidationError,
} from "./api/utils/errors.js";

const app = new Hono().basePath("/api/v1");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);

app.onError((err, c) => {
  if (err instanceof ZodValidationError) {
    return c.json(
      {
        message: "Validation error",
        details: err.formattedError,
        success: false,
      },
      400
    );
  }

  if (err instanceof DuplicateEntryError) {
    return c.json({ message: err.message, details: null, success: false }, 401);
  }

  if (err instanceof PgError) {
    return c.json(
      {
        message: err.getResponseMessageFromPgError(err.originalError),
        details: err,
        success: false,
      },
      500
    );
  }

  if (err instanceof InternalServerError) {
    return c.json(
      {
        message: "Internal server error",
        details: err.message,
        success: false,
      },
      500
    );
  }

  return c.json(
    { message: "An unexpected error occurred", details: err, success: false },
    500
  );
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}/api/v1`);

serve({
  fetch: app.fetch,
  port,
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
