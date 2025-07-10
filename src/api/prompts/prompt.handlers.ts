import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./prompt.schemas.js";
import { ZodValidationError } from "../utils/errors.js";
import { promptTemplates } from "./prompts.js";
const factory = createFactory();
import { GoogleGenAI } from "@google/genai";
import { successResponse } from "../utils/response.js";
import { processAIRequest } from "./ai.js";
import { questionsSchema } from "../../schema/question.schemas.js";
import { createId } from "@paralleldrive/cuid2";
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || "",
});

export const refineQuestionHandler = factory.createHandlers(
  validator("json", (values) => {
    const { data, error } = v.questionRefinementContextSchema.safeParse(values);
    if (error) throw new ZodValidationError(error);
    return data;
  }),
  async (c) => {
    const data = c.req.valid("json");
    const refinedQuestion = await processAIRequest(data)
    return successResponse(c, refinedQuestion, "Question refined successfully");
  }
);

export const generateQuestionsHandler = factory.createHandlers(
  validator("json", (values) => {
    const { data, error } = v.questionGenerationContextSchema.safeParse(values);
    if (error) throw new ZodValidationError(error);
    return data;
  }), async (c) => {
    const data = c.req.valid("json");
    const generatedQuestions = await processAIRequest(data);
     const questionsWithCUID2s = generatedQuestions.map((q: any) => ({
      ...q,
      id: createId(),
      
    }));

    const finalValidatedQuestions = questionsSchema.parse(questionsWithCUID2s);
    return successResponse(c, finalValidatedQuestions, "Questions generated successfully");
  }
)

export const translateQuestionHandler = factory.createHandlers(
  validator("json", (values) => {
    const { data, error } = v.translationContextSchema.safeParse(values);
    if (error) throw new ZodValidationError(error);
    return data;
  }),
  async (c) => {
    const data = c.req.valid("json");
    const translatedContent = await processAIRequest(data);
    return successResponse(c, translatedContent, "Content translated successfully");
  }
);

export const explainChartHandler = factory.createHandlers(
  validator("json", (values) => {
    const { data, error } = v.chartExplanationContextSchema.safeParse(values);
    if (error) throw new ZodValidationError(error);
    return data;
  }),
  async (c) => {
    const data = c.req.valid("json");
    const translatedChart = await processAIRequest(data);
    return successResponse(c, translatedChart, "Chart translated successfully");
  }
);