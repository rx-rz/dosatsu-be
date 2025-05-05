import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { questionsSchema, v } from "./question.schemas.js";
import { questionRepository } from "./question.repository.js";
import { successResponse } from "../utils/response.js";

const factory = createFactory();

export const createOrUpdateQuestion = factory.createHandlers(
  validator("json", (value) => {
    const parsed = questionsSchema.parse(value);
    console.log("YO!");
    return parsed;
  }),
  validator("param", (value) => {
    const parsed = v.surveyIdSchema.parse(value);
    console.log("HERE!");
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const { surveyId } = c.req.valid("param");
    await questionRepository.upsertQuestion({ dto, surveyId });
    return successResponse(c, {}, "Questions created", 201);
  }
);

export const getQuestion = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const question = await questionRepository.getQuestionById({ id });
    if (!question) {
      return c.json({ message: "Question not found" }, 404);
    }
    return c.json({ question }, 200);
  }
);

export const getQuestionsBySurveyId = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.surveyIdSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { surveyId } = c.req.valid("param");
    const questions = await questionRepository.getQuestionsBySurveyId({
      surveyId,
    });
    console.log(questions)
    return successResponse(c, {questions}, "Questions fetched successfully", 200);
  }
);

export const deleteQuestion = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const question = await questionRepository.deleteQuestion({ id });
    return c.json({ question }, 200);
  }
);
