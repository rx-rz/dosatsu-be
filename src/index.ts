import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./api/auth/auth.routes.js";
import {
  DuplicateEntryError,
  InternalServerError,
  PgError,
  ZodValidationError,
} from "./api/utils/errors.js";
import { surveyRouter } from "./api/surveys/survey.routes.js";
import { errorResponse } from "./api/utils/response.js";

const app = new Hono().basePath("/api/v1");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/surveys", surveyRouter);
app.onError((err, c) => {
  if (err instanceof ZodValidationError) {
    return errorResponse(c, err.message, 400, undefined, err.formattedError);
  }

  if (err instanceof DuplicateEntryError) {
    return errorResponse(c, err.message, 409, undefined, err.cause);
  }

  if (err instanceof PgError) {
    return errorResponse(
      c,
      err.getResponseMessageFromPgError(err.originalError),
      500,
      undefined,
      err.originalError
    );
  }

  if (err instanceof InternalServerError) {
    return errorResponse(c, err.message, 500, undefined, err.cause);
  }

  return errorResponse(c, "An unexpected error occurred", 500, undefined, err);
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
