import { Hono } from "hono";

export const answerRouter = new Hono()

//get answers for a response
answerRouter.get('/responses/:responseId/answers')

//get answers for a question
answerRouter.get('/questions/:questionId/answers')