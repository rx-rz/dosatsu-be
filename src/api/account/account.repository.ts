import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/index.js";

const getAccountDetailsByAccountId = async ({
  accountId,
}: {
  accountId: string;
}) => {
  return await prisma.account.findFirst({
    where: {
      id: accountId,
    },
  });
};

const updateAccountDetailsByAccountId = async ({
  id,
  dto,
}: {
  id: string;
  dto: Prisma.AccountUpdateInput;
}) => {
  return await prisma.account.update({
    where: {
      id,
    },
    data: { ...dto },
  });
};



export const accountRepository = {
  getAccountDetailsByAccountId,
  updateAccountDetailsByAccountId
};
