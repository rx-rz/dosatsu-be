import { z } from "zod";

// Define Zod schemas for the nested objects
const answerSchema = z.object({
  questionId: z.string().cuid2(),
  answerText: z.string().nullable(),
  answerNumber: z.number().nullable(),
  answerJson: z.any(),
});

const idSchema = z.object({
  id: z.string().cuid2(),
});

const responseSchema = z.object({
  accountId: z.string().cuid2().nullable(),
  answers: z.array(answerSchema),
});

const createResponseSchema = z.object({
  response: z.object({
    accountId: z.string().cuid2().nullable(),
  }),
  answers: z.array(answerSchema),
});

// Define the type for the input data
export type CreateResponseDto = z.infer<typeof createResponseSchema>;

export const v = {
  answerSchema,
  idSchema,
  responseSchema,
  createResponseSchema,
};
