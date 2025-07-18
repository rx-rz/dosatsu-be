import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./api/auth/auth.routes.js";
import {
  DuplicateEntryError,
  InternalServerError,
  PgError,
} from "./api/utils/errors.js";
import { surveyRouter } from "./api/surveys/survey.routes.js";
import { errorResponse } from "./api/utils/response.js";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { questionRouter } from "./api/questions/question.routes.js";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { responseRouter } from "./api/responses/response.routes.js";
import { promptRouter } from "./api/prompts/prompt.routes.js";

const app = new Hono().basePath("/api/v1");

app.use(secureHeaders());

app.use(cors({
  origin: "https://ibeere-fe.vercel.app",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRouter);
app.route("/surveys", surveyRouter);
app.route("/ai", promptRouter);
app.route("", responseRouter);
app.route("", questionRouter);

app.onError((err, c) => {
  console.error(err);
  if (err instanceof ZodError) {
    return errorResponse(
      c,
      err.message,
      400,
      undefined,
      fromError(err).toString
    );
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

app.notFound((c) => {
  return c.text("Nothing for you", 404);
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on this port: {info.port}`);
  }
);
