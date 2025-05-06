import { prisma } from "../../db/index.js";
import { createId } from "@paralleldrive/cuid2";
import type { CreateSurveyDto } from "./survey.schemas.js";
import type { Prisma } from "@prisma/client";

const createSurvey = async (dto: Prisma.SurveyCreateInput) => {
  const survey = await prisma.survey.create({
    data: {
      ...dto,
      id: createId(),
    },
    select: {
      id: true,
    },
  });
  return { id: survey.id };
};

const updateSurvey = async ({
  dto,
  accountId,
  surveyId,
}: {
  dto: Partial<CreateSurveyDto>;
  accountId: string;
  surveyId: string;
}) => {
  return await prisma.survey.update({
    where: { id: surveyId },
    data: {
      ...dto,
      id: surveyId,
      accountId: accountId,
    },
    select: {
      id: true,
      accountId: true,
      createdAt: true,
      updatedAt: true
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

const getSurveysByAccountID = async ({ accountId }: { accountId: string }) => {
  return await prisma.survey.findMany({
    where: { accountId },
    orderBy: { updatedAt: "desc" },
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
  getSurveysByAccountID,
  getSurveyBySurveyID,
  deleteSurveyBySurveyID,
};
