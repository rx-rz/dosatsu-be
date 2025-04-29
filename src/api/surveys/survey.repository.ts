import { prisma } from "../../db/index.js";
import { createId } from "@paralleldrive/cuid2";
import type { CreateSurveyDto } from "./survey.schemas.js";

const createSurvey = async (dto: CreateSurveyDto) => {
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
  surveyId,
}: {
  dto: Partial<CreateSurveyDto>;
  surveyId: string;
}) => {

  return await prisma.survey.update({
    where: { id: surveyId },
    data: {
      ...dto,
      id: surveyId,
      userId: dto.userId,
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
