import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./survey.schemas.js";
import { surveyRepository } from "./survey.repository.js";
import { errorResponse, successResponse } from "../utils/response.js";
const factory = createFactory();

export const createSurvey = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createSurveySchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const survey = await surveyRepository.createSurvey(dto);
    if (!survey) {
      return errorResponse(c, "Failed to create survey", 500);
    }
    return successResponse(
      c,
      { id: survey.id },
      "Survey created successfully",
      201
    );
  }
);

export const updateSurvey = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.updateSurveySchema.parse(value);
    return parsed;
  }),
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const surveyId = c.req.valid("param");
    const survey = await surveyRepository.updateSurvey({
      dto,
      surveyId,
    });
    if (!survey) {
      return errorResponse(c, "Failed to update survey", 500);
    }
    return successResponse(
      c,
      { id: survey.id },
      "Survey updated successfully",
      200
    );
  }
);

export const listSurveys = factory.createHandlers(
  validator("param", (value) => {
    console.log(value);
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const userId = c.req.valid("param");
    const userSurveys = surveyRepository.getSurveysByUserID({ userId });
    return c.json({ surveys: userSurveys }, 200);
  }
);

export const getSurvey = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const surveyId = c.req.valid("param");
    const survey = surveyRepository.getSurveyBySurveyID({ surveyId });
    return c.json({ survey }, 200);
  }
);

export const publishSurvey = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const surveyId = c.req.valid("param");
    const survey = surveyRepository.updateSurvey({
      dto: { isPublished: true },
      surveyId,
    });
    return c.json({ survey }, 200);
  }
);

export const deleteSurvey = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const surveyId = c.req.valid("param");
    const survey = surveyRepository.deleteSurveyBySurveyID({ surveyId });
    return c.json({ survey }, 200);
  }
);
