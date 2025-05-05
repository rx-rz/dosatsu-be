import { Hono } from "hono";
import { createOrUpdateQuestion, deleteQuestion, getQuestion, getQuestionsBySurveyId } from "./question.handlers.js";
import { requireAuth } from "../middleware/index.js";

export const questionRouter = new Hono()

questionRouter.post('/surveys/:surveyId/questions', requireAuth, ...createOrUpdateQuestion)

questionRouter.get('/surveys/:surveyId/questions', requireAuth, ...getQuestionsBySurveyId)

questionRouter.get('/surveys/:surveyId/questions/:id', requireAuth, ...getQuestion)

questionRouter.delete('/surveys/:surveyId/questions/:id', requireAuth, ...deleteQuestion)


