import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./survey.schemas.js";
import { surveyRepository } from "./survey.repository.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { getJWTPayload } from "../utils/jwt-payload.js";
import { createId } from "@paralleldrive/cuid2";
const factory = createFactory();

export const createSurvey = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createSurveySchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const accountId = getJWTPayload(c)?.account_id;
    const survey = await surveyRepository.createSurvey({
      ...dto,
      id: createId(),
      account: { connect: { id: accountId } },
    });
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
    const { id: surveyId } = c.req.valid("param");
    const accountId = getJWTPayload(c)?.account_id;
    const survey = await surveyRepository.updateSurvey({
      dto,
      accountId,
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

export const listSurveys = factory.createHandlers(async (c) => {
  const accountId = getJWTPayload(c)?.account_id;
  const surveys = await surveyRepository.getSurveysByAccountID({ accountId });
  return successResponse(c, { surveys }, "Surveys fetched successfully", 200);
});

export const getSurvey = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { id: surveyId } = c.req.valid("param");
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
    const { id: surveyId } = c.req.valid("param");
    const accountId = getJWTPayload(c)?.account_id;
    const survey = surveyRepository.updateSurvey({
      dto: { isPublished: true },
      surveyId,
      accountId,
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
    const { id: surveyId } = c.req.valid("param");

    const survey = surveyRepository.deleteSurveyBySurveyID({ surveyId });
    if (!survey) {
      return successResponse(
        c,
        { id: surveyId },
        "Survey deleted successfully",
        200
      );
    }
    return successResponse(c, { survey }, "Survey deleted successfully", 200);
  }
);
