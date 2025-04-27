import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./question.schemas.js";
import { questionRepository } from "./question.repository.js";

const factory = createFactory();

export const createOrUpdateQuestion = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createQuestionSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const question = await questionRepository.upsertQuestion({ dto });
    return c.json(
      { id: question.id, message: "Question created successfully" },
      201
    );
  }
);

export const getQuestion = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const id = c.req.valid("param");
    const question = await questionRepository.getQuestionById({ id });
    if (!question) {
      return c.json({ message: "Question not found" }, 404);
    }
    return c.json({ question }, 200);
  }
);

export const getQuestionsBySurveyId = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const surveyId = c.req.valid("param");
    const questions = await questionRepository.getQuestionsBySurveyId({
      surveyId,
    });
    return c.json({ questions }, 200);
  }
);

export const deleteQuestion = factory.createHandlers(validator("param", (value) => {
    const parsed = v.idSchema.parse(value)
    return parsed
}), async (c) => {
    const id = c.req.valid("param")
    const question = await questionRepository.deleteQuestion({id})
    return c.json({question}, 200)
})
