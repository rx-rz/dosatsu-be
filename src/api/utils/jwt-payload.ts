import type { Context } from "hono";
import type { JWTPayload } from "../middleware/index.js";
import { verify } from "hono/jwt";

export const getJWTPayload = async (c: Context): Promise<JWTPayload> => {
  let payload = c.get("jwt_payload") as JWTPayload;

  if (!payload) {
    // Try to extract from Authorization header
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        payload = (await verify(token, process.env.JWT_SECRET!)) as JWTPayload;
      } catch (error) {
        throw new Error("Invalid JWT token");
      }
    }
  }

  if (!payload) {
    throw new Error("JWT payload not found");
  }

  return payload;
};
