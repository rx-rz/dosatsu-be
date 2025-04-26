import { createFactory } from "hono/factory";
import { getJWTPayload } from "../utils/jwt-payload.js";
import { accountRepository } from "./account.repository.js";
import { validator } from "hono/validator";
import { ZodValidationError } from "../utils/errors.js";
import { v } from "./account.schemas.js";
import { hashValue } from "../../lib/hash.js";
import { compare } from "bcryptjs";

const factory = createFactory();

export const getUserAccountDetails = factory.createHandlers(async (c) => {
  const { account_id } = getJWTPayload(c);
  const account = await accountRepository.getAccountDetailsByAccountId({
    accountId: account_id,
  });
  if (!account) {
    return c.json(
      { success: false, message: "Account not found", details: null },
      404
    );
  }
  return c.json(
    { success: true, message: "Account details", details: account },
    200
  );
});

export const updateAccountDetails = factory.createHandlers(
  validator("json", (value) => {
    const { data, error } = v.updateAccountDetailsSchema.safeParse(value);
    if (error) throw new ZodValidationError(error);
    return data;
  }),
  async (c) => {
    const dto = c.req.valid("json");
    const { account_id } = getJWTPayload(c);
    const account = await accountRepository.updateAccountDetailsByAccountId({
      id: account_id,
      dto,
    });
    if (!account) {
      return c.json(
        { success: false, message: "Account not found", details: null },
        404
      );
    }
    return c.json(
      { success: true, message: "Account details updated", details: account },
      200
    );
  }
);

export const updateAccountPassword = factory.createHandlers(validator("json", (value) => {
  const { data, error } = v.updateAccountPasswordSchema.safeParse(value);
  if (error) throw new ZodValidationError(error);
  return data;
}),async (c) => {
  const dto = c.req.valid("json");
  const { account_id } = getJWTPayload(c);
  const account = await accountRepository.getPasswordByAccountId({
    accountId: account_id,
  });
  if (!account) {
    return c.json(
      { success: false, message: "Account not found", details: null },
      404
    );
  }
  if (await compare(dto.oldPassword, account.password ?? "") === false) {
    return c.json(
      { success: false, message: "Old password is incorrect", details: null },
      401
    );
  }
  const updatedAccount = await accountRepository.updateAccountPasswordByAccountId({
    accountId: account_id,
    password: await hashValue(dto.newPassword),
  });
  if (!updatedAccount) {
    return c.json(
      { success: false, message: "Account not found", details: null },
      404
    );
  }
  return c.json(
    { success: true, message: "Account password updated", details: updatedAccount },
    200
  );
});

export const updateAccountEmail = factory.createHandlers(validator("json", (value) => {
const { data, error } = v.updateAccountEmailSchema.safeParse(value);
if (error) throw new ZodValidationError(error);
return data;
}),
 async (c) => {
  const dto = c.req.valid("json");
  const { account_id, email: oldEmail } = getJWTPayload(c);
  const passwordDetails = await accountRepository.getPasswordByAccountId({
    accountId: account_id,
  });
  if (!passwordDetails) {
    return c.json(
      { success: false, message: "Account not found", details: null },
      404
    );
  }
  if (await compare(dto.password, passwordDetails.password ?? "") === false) {
    return c.json(
      { success: false, message: "Password is incorrect", details: null },
      401
    );
  }
  const updatedAccount = await accountRepository.updateUserEmail({
    oldEmail: oldEmail ?? "",
    newEmail: dto.newEmail,
  });
  if (!updatedAccount) {
    return c.json(
      { success: false, message: "Account not found", details: null },
      404
    );
  }
  return c.json(
    { success: true, message: "Account email updated", details: updatedAccount },
    200
  );
 });
