import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/index.js";

const checkIfQuestionExists = async ({id}: {id: string}) => {
  return await prisma.question.findUnique({
    where: {id},
    select: {id: true}
  })
}

const upsertQuestion = async ({ dto }: { dto: Prisma.QuestionCreateInput }) => {
  return await prisma.question.upsert({
    where: { id: dto.id }, 
    update: dto,
    create: dto,
    select: { id: true },
  });
};


const getQuestionById = async ({id}: { id: string }) => {
  return await prisma.question.findUnique({
    where: { id},
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

const getQuestionsBySurveyId = async ({ surveyId }: { surveyId: string }) => {
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

const updateQuestion = async ({
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

const deleteQuestion = async (id: { id: string }) => {
  return await prisma.question.delete({
    where: { id: id.id },
  });
};

export const questionRepository = {
  checkIfQuestionExists,
  upsertQuestion,
  getQuestionById,
  getQuestionsBySurveyId,
  updateQuestion,
  deleteQuestion,
};
