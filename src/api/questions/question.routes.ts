import { Hono } from "hono";
import { createOrUpdateQuestion, deleteQuestion, getQuestion, getQuestionsBySurveyId } from "./question.handlers.js";

export const questionRouter = new Hono()

questionRouter.post('/surveys/:surveyId/questions', ...createOrUpdateQuestion)

questionRouter.get('/surveys/:surveyId/questions', ...getQuestionsBySurveyId)

questionRouter.get('/surveys/:surveyId/questions/:id', ...getQuestion)

questionRouter.delete('/surveys/:surveyId/questions/:id', ...deleteQuestion)

