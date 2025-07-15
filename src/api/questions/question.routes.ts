import { Hono } from "hono";
import { createOrUpdateQuestion, deleteQuestion, getQuestion, getQuestionAnswersBySurveyId, getQuestionsBySurveyId } from "./question.handlers.js";
import { requireAuth } from "../middleware/index.js";

export const questionRouter = new Hono()

questionRouter.post('/surveys/:surveyId/questions', requireAuth, ...createOrUpdateQuestion)

questionRouter.get('/surveys/:surveyId/questions', ...getQuestionsBySurveyId)

questionRouter.get('/surveys/:surveyId/questions/:id',  ...getQuestion)

questionRouter.get('/surveys/:surveyId/question-answers', requireAuth, ...getQuestionAnswersBySurveyId)

questionRouter.delete('/surveys/:surveyId/questions/:id', requireAuth, ...deleteQuestion)

