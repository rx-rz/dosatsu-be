import { createFactory } from "hono/factory";
import { validator } from "hono/validator";
import { surveyIdSchema } from "../../schema/index.js";
import { getAnswersBySurveyId } from "./answer.repository.js";

const factory = createFactory()

export const getAllSurveyAnswers = factory.createHandlers(validator("param",(value) => {
    const parsed = surveyIdSchema.parse(value)
    return parsed
}), async (c) => {
    const {surveyId} = c.req.valid("param")

    const answers = await getAnswersBySurveyId({surveyId})
    
})