import { Hono } from "hono";
import {
  generateQuestionsHandler,
  refineQuestionHandler,
  explainChartHandler,
  translateQuestionHandler,
} from "./prompt.handlers.js";

export const promptRouter = new Hono();

promptRouter.post("/refine", ...refineQuestionHandler);
promptRouter.post("/generate", ...generateQuestionsHandler); 
promptRouter.post("/translate", ...translateQuestionHandler); 
promptRouter.post("/explain-chart", ...explainChartHandler); 
