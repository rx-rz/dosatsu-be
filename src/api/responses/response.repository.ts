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

export const responseRepository = {
  createResponse,
};
