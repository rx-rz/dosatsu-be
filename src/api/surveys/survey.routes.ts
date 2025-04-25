import { Hono } from "hono";
import {
  createSurvey,
  deleteSurvey,
  getSurvey,
  listSurveys,
  publishSurvey,
} from "./survey.handlers.js";

export const surveyRouter = new Hono();

surveyRouter.post("/", ...createSurvey);

surveyRouter.get("/:id", ...getSurvey);

surveyRouter.get("/", ...listSurveys);

surveyRouter.delete("/:id", ...deleteSurvey);

surveyRouter.patch("/:id/publish", ...publishSurvey);
