import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/index.js";

export const createQuestion = async (dto: Prisma.QuestionCreateInput) => {
  return await prisma.question.create({ data: dto });
};

export const getQuestionById = async (id: { id: string }) => {
  return await prisma.question.findUnique({
    where: { id: id.id },
    include: {
      answers: {
        select: {
          id: true,
          answerText: true,
          answerJson: true,
          answerNumber: true,
          questionId: true,
          createdAt: true,
        },
      },
    },
  });
};

export const getQuestionsBySurveyId = async ({
  surveyId,
}: {
  surveyId: string;
}) => {
  return await prisma.question.findMany({
    where: { surveyId },
    // include: {
    //     answers: {
    //         select: {
    //             id: true,
    //             answerText: true,
    //             answerJson: true,
    //             answerNumber: true,
    //             questionId: true,
    //             createdAt: true,

    //         },
    //     }
    // },
  });
};

export const updateQuestion = async ({
  questionId,
  dto,
}: {
  questionId: string;
  dto: Prisma.QuestionUpdateInput;
}) => {
  return await prisma.question.update({
    where: { id: questionId },
    data: dto,
  });
};

export const deleteQuestion = async (id: { id: string }) => {
  return await prisma.question.delete({
    where: { id: id.id },
  });
}
