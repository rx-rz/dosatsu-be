import { prisma } from "../../db/index.js";
import { createId } from "@paralleldrive/cuid2";
import type { CreateSurveyDto } from "./survey.schemas.js";

const createSurvey = async (dto: CreateSurveyDto) => {
  const { questions, ...surveyValues } = dto;
  const survey = await prisma.survey.create({
    data: {
      ...surveyValues,
      id: createId(),
      questions: {
        createMany: {
          data: dto.questions.map((q) => ({
            questionText: q.questionText,
            orderNumber: q.orderNumber,
            id: q.id,
            options: q.options,
            required: q.required ?? true,
          })),
        },
      },
    },
    include: { questions: true },
  });
  return { id: survey.id };
};

const updateSurvey = async ({dto, surveyId}: {dto: Partial<CreateSurveyDto>, surveyId: string},) => {
  const { questions, ...surveyOptions } = dto;
  return await prisma.survey.update({
    where: { id: surveyId },
    data: {
      ...surveyOptions,
      questions: {
        update:
          questions &&
          questions.map((q) => ({
            where: { id: q.id },
            data: {
              questionText: q.questionText,
              orderNumber: q.orderNumber,
              options: q.options,
              required: q.required,
            },
          })),
        deleteMany: {
          surveyId,
          NOT: questions && questions.map((q) => ({ id: q.id })),
        },
      },
    },
    select: {
      id: true,
    },
  });
};

const getSurveyBySurveyID = async ({ surveyId }: { surveyId: string }) => {
  return await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      questions: { where: { surveyId }, orderBy: { orderNumber: "asc" } },
    },
  });
};

const getSurveysByUserID = async ({ userId }: { userId: string }) => {
  return await prisma.survey.findMany({
    where: { userId },
  });
};

const deleteSurveyBySurveyID = async ({ surveyId }: { surveyId: string }) => {
  return await prisma.survey.delete({
    where: { id: surveyId },
    select: { id: true },
  });
};

export const surveyRepository = {
  createSurvey,
  updateSurvey,
  getSurveysByUserID,
  getSurveyBySurveyID,
  deleteSurveyBySurveyID,
};
