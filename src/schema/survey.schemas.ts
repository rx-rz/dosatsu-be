import { z } from "zod";

const idSchema = z.object({
  id: z.string().cuid2()
}) 
const createSurveySchema = z.object({
  title: z.string().min(1).default("Untitled Survey"),
  description: z.string().optional(),
  requiresSignIn: z.boolean().optional().default(false),
  showProgressBar: z.boolean().optional().default(false),
  showLinkToSubmitAnother: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
});

export const updateSurveySchema = createSurveySchema
  .merge(z.object({ id: z.string().cuid() }))
  .partial();

export type CreateSurveyDto = z.infer<typeof createSurveySchema>;
export type UpdateSurveyDto = z.infer<typeof updateSurveySchema>;
export const v = { idSchema, createSurveySchema, updateSurveySchema };
