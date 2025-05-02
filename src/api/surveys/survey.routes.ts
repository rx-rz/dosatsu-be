import { Hono } from "hono";
import {
  createSurvey,
  deleteSurvey,
  getSurvey,
  listSurveys,
  publishSurvey,
  updateSurvey,
} from "./survey.handlers.js";
import { requireAuth } from "../middleware/index.js";

export const surveyRouter = new Hono();

surveyRouter.post("/", requireAuth, ...createSurvey);

surveyRouter.get("/:id", requireAuth, ...getSurvey);

surveyRouter.get("/", requireAuth, ...listSurveys);

surveyRouter.patch("/:id", ...updateSurvey);

surveyRouter.patch("/:id/publish", ...publishSurvey);

surveyRouter.delete("/:id", ...deleteSurvey);

