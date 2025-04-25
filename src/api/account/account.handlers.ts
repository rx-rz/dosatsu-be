// import { createFactory } from "hono/factory";
// import { getJWTPayload } from "../utils/jwt-payload.js";
// import { accountRepository } from "./account.repository.js";
// import { validator } from "hono/validator";
// import { ZodValidationError } from "../utils/errors.js";
// import { v } from "./account.schemas.js";

// const factory = createFactory()

// export const getAccountDetails = factory.createHandlers(async(c) => {
//     const {id} = getJWTPayload(c)
//     const account = await accountRepository.getAccountDetailsByAccountId({accountId: id})
//     if (!account) {
//         return c.json({success: false, message: "Account not found", details: null}, 404)
//     }
//     return c.json({success: true, message: "Account details", details: account}, 200)
// })

// export const updateAccountDetails = factory.createHandlers(validator("json", (value) => {
//     const {data, error} = v.updateAccountDetailsSchema.safeParse(value)
//     if (error) throw new ZodValidationError(error)
//     return data
// }), async(c) => {
//     const {id} = getJWTPayload(c)

// })

// export const updateAccountPassword = factory.createHandlers(async() => {})

// export const updateAccountEmail = factory.createHandlers(async() => {})