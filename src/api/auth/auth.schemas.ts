import { z } from "zod";

const passwordSchema = z
  .string()
  .nonempty()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be at most 100 characters long");
// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
// .regex(/[a-z]/, "Password must contain at least one lowercase letter")
// .regex(/\d{1,}/, "Password must contain at least one digit")
// .regex(/^\S*$/, "Password must not contain spaces");

const emailSchema = z.string().email().max(255).nonempty()


export type EmailDto = z.infer<typeof emailSchema>;

const registerUserSchema = z.object({
  password: passwordSchema,
  email: z.string().email().max(255).nonempty(),
  name: z.string().min(2).max(255).nonempty(),
});

const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

const changeUserEmailSchema = z.object({
  password: passwordSchema,
  oldEmail: emailSchema,
  newEmail: emailSchema,
})

export const v = {
  registerUserSchema,
  loginUserSchema,
  changeUserEmailSchema
};
