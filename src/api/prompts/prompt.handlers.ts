import { createFactory } from "hono/factory";
import { validator } from "hono/validator";

const factory = createFactory()

export const generateEntireSurvey = factory.createHandlers(validator("json", (value) => {
    
}))
