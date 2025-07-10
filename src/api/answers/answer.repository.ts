import { prisma } from "../../db/index.js";

export const getAnswersBySurveyId = async ({
  surveyId,
}: {
  surveyId: string;
}) => {
  return await prisma.answer.findMany({
    where: {
      response: {
        surveyId,
      },
    },
  });
};
