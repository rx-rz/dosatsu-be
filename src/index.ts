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
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { questionRouter } from "./api/questions/question.routes.js";

const app = new Hono().basePath("/api/v1");

app.use(secureHeaders());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 3600,
    exposeHeaders: ["Content-Range", "X-Content-Range"],
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/surveys", surveyRouter);
app.route("", questionRouter);
app.onError((err, c) => {
  console.error(err);
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
