import { Hono } from "hono";

export const responseRouter = new Hono()

//get all responses for a survey
responseRouter.get('/surveys/:id/responses')

//submit a new response
responseRouter.post('/surveys/:id/responses')

//get a specific response with answers
responseRouter.get('/responses/:id')

