import { z } from "zod";

 const updateAccountDetailsSchema = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
})


 const updateAccountPasswordSchema = z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters long"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
})

const updateAccountEmailSchema = z.object({
    newEmail: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})
export const v = {
       updateAccountDetailsSchema,
       updateAccountPasswordSchema,
       updateAccountEmailSchema
}