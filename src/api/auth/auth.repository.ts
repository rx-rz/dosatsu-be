import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db/index.js";

const createUser = async (dto: Omit<Prisma.UserCreateInput, "id">, tx: any) => {
  const user = await tx.user.create({
    data: { ...dto, id: createId() },
    select: {
      id: true,
    },
  });
  return user as { id: string };
};

const createAccount = async (
  dto: Omit<Prisma.AccountCreateInput, "id">,
  tx: any
) => {
  const account = await tx.account.create({
    data: {
      ...dto,
      id: createId(),
    },
    select: {
      id: true,
      userId: true,

    },
  });
  return account as { id: string; userId: string };
};

const findUserByEmail = async ({ email }: { email: string }, tx = prisma) => {
  return await tx.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      updatedAt: true,
    },
  });
};

const findAccountByAccountId = async ({
  accountId,
  providerId,
}: {
  accountId: string;
  providerId: "credentials" | "google";
}) => {
  return await prisma.account.findFirst({
    where: { accountId, providerId },
    include: { user: { select: { email: true, name: true, emailVerified: true } } },
  });
};

export const authRepository = {
  createUser,
  createAccount,
  findUserByEmail,
  findAccountByAccountId,
};
