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

surveyRouter.get("/:id", requireAuth,  ...getSurvey);

surveyRouter.get("/", requireAuth, ...listSurveys);

surveyRouter.patch("/:id", requireAuth, ...updateSurvey);

surveyRouter.patch("/:id/publish", requireAuth, ...publishSurvey);

surveyRouter.delete("/:id", requireAuth, ...deleteSurvey);

