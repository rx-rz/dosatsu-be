import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./response.schemas.js";
import { responseRepository } from "./response.repository.js";
import { errorResponse, successResponse } from "../utils/response.js";

const factory = createFactory();

export const createResponse = factory.createHandlers(
  validator("json", (value) => {
    const parsed = v.createResponseSchema.parse(value);
    return parsed;
  }),
  validator("param", (value) => {
    const parsed = v.idSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { answers, response: responseData } = c.req.valid("json");
    if (responseData.accountId) {
      const response = await responseRepository.createResponse({
        response: {
          account: { connect: { id: responseData.accountId } },
          survey: { connect: { id } },
        },
        answers,
      });
      return successResponse(
        c,
        { response },
        "Response collected successfully",
        201
      );
    } else {
      const response = await responseRepository.createResponse({
        response: {
          survey: { connect: { id } },
        },
        answers,
      });
      return successResponse(
        c,
        { response },
        "Response collected successfully",
        201
      );
    }
  }
);

export const getResponses = factory.createHandlers(
  validator("param", (value) => {
    const parsed = v.surveyIdSchema.parse(value);
    return parsed;
  }),
  async (c) => {
    const { surveyId } = c.req.valid("param");
    const responses = await responseRepository.getResponsesBySurveyId({
      surveyId,
    });
    if (!responses){
      return errorResponse(c, "Response not found", 404)
    }
    return successResponse(c, responses, "Responses fetched successfully", 200)
  }
);

export const getResponse = factory.createHandlers(validator("param", (value) => {
  const parsed = v.idSchema.parse(value)
  return parsed
}), async (c) => {
  const {id} = c.req.valid("param")
  const response = await responseRepository.getResponseDetailsByResponseId({id})
  if(!response){
    return errorResponse(c, "Response not found", 404)
  }
  return successResponse(c, response, "Response fetched successfully", 200)
});
