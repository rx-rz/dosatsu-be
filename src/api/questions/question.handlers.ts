import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { questionsSchema, v } from "../../schema/question.schemas.js";
import { questionRepository } from "./question.repository.js";
import { errorResponse, successResponse } from "../utils/response.js";

const factory = createFactory();

export const createOrUpdateQuestion = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createQuestionsSchema.parse(value);
    return parsed;
  }),
  validator("param", (value) => {
    const parsed = v.surveyIdSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const { surveyId } = c.req.valid("param");
    console.log({dto})
    const questions = await Promise.all(
      dto.map((questionDto) =>
        questionRepository.upsertQuestion({ dto: questionDto, surveyId })
      )
    );


    return successResponse(c, { questions }, "Questions created", 201);
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
      return errorResponse(c, "Question not found", 404);
    }
    return successResponse(
      c,
      { question },
      "Question fetched successfully",
      200
    );
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
    return successResponse(
      c,
      { questions },
      "Questions fetched successfully",
      200
    );
  }
);

export const getQuestionAnswersBySurveyId = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.surveyIdSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { surveyId } = c.req.valid("param");
    const questions = await questionRepository.getQuestionAnswersBySurveyId({
      surveyId,
    });
    return successResponse(
      c,
      { questions },
      "Questions fetched successfully",
      200
    );
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
    return successResponse(
      c,
      { question },
      "Question successfully deleted",
      200
    );
  }
);
