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

const updateUserAccountDetailsByEmail = async ({
  email,
  dto,
}: {
  email: string;
  dto: Prisma.UserUpdateInput;
}) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      ...dto,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });
};

const updateAccountDetailsByAccountId = async ({
  id,
  dto,
}: {
  id: string;
  dto: { name?: string; image?: string };
}) => {
  return await prisma.account.update({
    where: {
      id,
    },
    data: { user: { update: dto } },
  });
};

const getPasswordByAccountId = async ({
  accountId,
}: {
  accountId: string;
}) => {
  return await prisma.account.findFirst({
    where: {
      id: accountId,
    },
    select: {
      password: true,
    },
  });
};
const updateAccountPasswordByAccountId = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  return await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      password,
    },
    select: {
      id: true,
    },
  });
};

const updateUserEmail = async ({oldEmail, newEmail}: {oldEmail: string, newEmail: string}) => {
  return await prisma.user.update({
    where: {
      email: oldEmail,
    },
    data: {
      email: newEmail,
    },
  });
}
export const accountRepository = {
  getAccountDetailsByAccountId,
  updateAccountDetailsByAccountId,
  updateUserAccountDetailsByEmail,
  getPasswordByAccountId,
  updateAccountPasswordByAccountId,
  updateUserEmail
};
