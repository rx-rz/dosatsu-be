import { Hono } from "hono";
import { createResponse } from "./response.handlers.js";

export const responseRouter = new Hono();

//get all responses for a survey
responseRouter.get("/surveys/:id/responses");

//submit a new response
responseRouter.post("/surveys/:id/responses", ...createResponse);

//get a specific response with answers
responseRouter.get("/responses/:id");
