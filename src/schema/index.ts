import { z } from "zod";

export const idSchema = z.object({
    id: z.string().cuid2(),
})

export const surveyIdSchema = z.object({
    surveyId: z.string().cuid2()
})

