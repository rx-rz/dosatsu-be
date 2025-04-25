import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./survey.schemas.js";
import { surveyRepository } from "./survey.repository.js";
const factory = createFactory();

export const createSurvey = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createSurveySchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { id: surveyId, ...surveyData } = c.req.valid("json");
    if (surveyId) {
      const survey = await surveyRepository.updateSurvey({
        dto: surveyData,
        surveyId,
      });
      if (!survey) {
        return c.json({ message: "Survey not found" }, 404);
      }
      return c.json(
        { id: survey.id, message: "Survey updated successfully" },
        200
      );
    }
    const survey = await surveyRepository.createSurvey(surveyData)
    return c.json({id: survey.id, message: "Survey created successfully"}, 201)
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
