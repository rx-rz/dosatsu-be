import { validator } from "hono/validator";
import { createFactory } from "hono/factory";
import { v } from "../../schema/auth.schemas.js";
import { hashValue } from "../../lib/hash.js";
import { prisma } from "../../db/index.js";
import { authRepository } from "./auth.repository.js";
import { compare } from "bcryptjs";
import { sign, verify } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { DuplicateEntryError, ZodValidationError } from "../utils/errors.js";
import type { JWTPayload } from "../middleware/index.js";
import { errorResponse, successResponse } from "../utils/response.js";

const factory = createFactory();

export const registerUser = factory.createHandlers(
  validator("json", (value) => {
    const { data, error } = v.registerUserSchema.safeParse(value);
    if (error) throw new ZodValidationError(error);
    return data;
  }),
  async (c) => {
    const { password, name, email } = c.req.valid("json")!;
    await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findFirst({
        where: {
          accountId: email,
          providerId: "credentials",
        },
      });
      if (existingAccount) {
        throw new DuplicateEntryError("Account already exists.");
      }
      const user = await authRepository.createUser(
        { email, name, emailVerified: false },
        tx
      );
      const hashedPassword = await hashValue(password);
      await authRepository.createAccount(
        {
          user: {
            connect: {
              id: user.id,
            },
          },
          providerId: "credentials",
          accountId: email,
          password: hashedPassword,
        },
        tx
      );
    });
    return successResponse(c, null, "User registered successfully", 201);
  }
);

export const loginUser = factory.createHandlers(
  validator("json", (value) => {
    return v.loginUserSchema.parse(value);
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const account = await authRepository.findAccountByAccountId({
      accountId: email,
      providerId: "credentials",
    });

    if (!account || !account.password) {
      return errorResponse(c, "Invalid credentials", 401);
    }

    const isValid = await compare(password, account.password);
    if (!isValid) {
      return errorResponse(c, "Invalid credentials", 401);
    }

    const payload = {
      account_id: account.id,
      email: account.user.email,
      is_verified: account.user.emailVerified,
      name: account.user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
    };

    const token = await sign(payload, process.env.JWT_SECRET!);

    setCookie(c, "access_token", `Bearer ${token}`, {
      httpOnly: true,
      secure: false, 
      sameSite: "None", 
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return successResponse(c, payload, "Login successful", 200);
  }
);

export const getCurrentSession = factory.createHandlers(async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(c, "No or invalid authorization header", 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload: JWTPayload = (await verify(
      token,
      process.env.JWT_SECRET ?? ""
    )) as unknown as JWTPayload;
    return c.json({ success: true, payload });
  } catch (err) {
    return errorResponse(c, "JWT Verification error", 401);
  }
});

export const logoutUser = factory.createHandlers(async (c) => {
  deleteCookie(c, "token");
});

export const verifyEmail = factory.createHandlers(async (c) => {});

export const signInWithGoogle = factory.createHandlers(async (c) => {});
