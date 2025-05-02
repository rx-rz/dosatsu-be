import type { Context } from "hono";
import type { JWTPayload } from "../middleware/index.js";

export const getJWTPayload = (c: Context): JWTPayload => {
    const payload = c.get("jwt_payload") as JWTPayload;
    if (!payload) {
        throw new Error("JWT payload not found");
    }
    return payload;
    
}