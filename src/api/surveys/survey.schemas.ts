import { z } from "zod";
import { questionSchema } from "../questions/question.schemas.js";

const idSchema = z.string().min(1, {message: "ID must not be less than 1"}).max(100, {message: "ID must not be more than 100"})

const createSurveySchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    requiresSignIn: z.boolean().optional().default(false),
    showProgressBar: z.boolean().optional().default(false),
    showLinkToSubmitAnother: z.boolean().optional().default(false),
    isPublished: z.boolean().optional().default(false),
    questions: z.array(questionSchema).min(1),
  })
  
export type CreateSurveyDto = z.infer<typeof createSurveySchema>
export const v = {idSchema, createSurveySchema}