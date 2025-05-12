import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/index.js";

const createResponse = async ({
  response,
  answers,
}: {
  response: Omit<Prisma.ResponseCreateInput, "id">;
  answers: Prisma.AnswerCreateInput[];
}) => {
  return await prisma.response.create({
    data: {
      ...response,
      answers: {
        createMany: {
          data: answers,
        },
      },
    },
    select: { id: true },
  });
};

export const getResponsesBySurveyId = async ({
  surveyId,
}: {
  surveyId: string;
}) => {
  return await prisma.response.findMany({
    where: {
      surveyId,
    },
  });
};

export const getResponseDetailsByResponseId = async ({
  id,
}: {
  id: string;
}) => {
  return await prisma.response.findUnique({
    where: { id },
    select: {
      surveyId: true,
      id: true,
      submittedAt: true,
      answers: true,
      account: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });
};

export const responseRepository = {
  createResponse,
  getResponsesBySurveyId,
  getResponseDetailsByResponseId,
};
