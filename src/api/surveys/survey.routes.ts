import { Hono } from "hono";
import { createSurvey, deleteSurvey, getSurvey, listSurveys, publishSurvey } from "./survey.handlers.js";

export const surveyRouter = new Hono()

surveyRouter.post('/surveys', ...createSurvey)

surveyRouter.get('/surveys/:id', ...getSurvey)

surveyRouter.get('/surveys', ...listSurveys)

surveyRouter.delete('/surveys/:id', ...deleteSurvey)

surveyRouter.patch('/surveys/:id/publish', ...publishSurvey)

