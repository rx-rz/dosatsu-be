import { Hono } from "hono";
import { requireAuth } from "../middleware/index.js";
import {
  getUserAccountDetails,
  updateAccountDetails,
  updateAccountEmail,
  updateAccountPassword,
} from "./account.handlers.js";

export const accountRouter = new Hono();

accountRouter.get("/account", requireAuth, ...getUserAccountDetails);

accountRouter.put("/account", requireAuth, ...updateAccountDetails);

accountRouter.put("/account/password", requireAuth, ...updateAccountPassword);

accountRouter.put("/account/email", requireAuth, ...updateAccountEmail);
