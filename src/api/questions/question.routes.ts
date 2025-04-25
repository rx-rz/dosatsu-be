import { Hono } from "hono";

export const questionRouter = new Hono()

questionRouter.post('/surveys/:surveyId/questions')

questionRouter.get('/surveys/:surveyId/questions')

questionRouter.put('/surveys/:surveyId/questions/:id')

questionRouter.delete('/surveys/:surveyId/questions/:id')

