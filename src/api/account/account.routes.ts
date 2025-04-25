import { Hono } from "hono";
import { requireAuth } from "../middleware/index.js";

export const accountRouter = new Hono()

accountRouter.get('/account', requireAuth)

accountRouter.put('/account')

accountRouter.put('/account/password')

accountRouter.put('/account/email')

