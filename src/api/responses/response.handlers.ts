import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { v } from "./response.schemas.js";
import { responseRepository } from "./response.repository.js";
import { createId } from "@paralleldrive/cuid2";
import { successResponse } from "../utils/response.js";

const factory = createFactory();

export const createResponse = factory.createHandlers(
  validator("json", (value) => {
    console.log({ jSON: value });
    const parsed = v.createResponseSchema.parse(value);
    return parsed;
  }),
  validator("param", (value) => {
    console.log({ param: value });
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
