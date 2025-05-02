import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";

export type JWTPayload = {
  account_id: string;
  email: string;
  name: string;
  exp: string;
  is_verified: boolean;
};
export const requireAuth = createMiddleware(async (c, next) => {
  const authHeader = getCookie(c, "access_token");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    deleteCookie(c, "access_token");
    return c.json({ success: false, message: "", details: null }, 401);
  }
  try {
    const payload: JWTPayload = (await verify(
      token,
      process.env.JWT_SECRET ?? ""
    )) as unknown as JWTPayload;
    // if (payload.is_verified === false) {
    //   return c.json(
    //     { success: false, message: "Verify account first", details: null },
    //     401
    //   );
    // }
    c.set("jwt_payload", payload);
  } catch (err) {
    if (err instanceof JwtTokenExpired) {
      deleteCookie(c, "access_token");
      return c.json(
        { success: false, message: "Token expired", details: err },
        401
      );
    }
    return c.json(
      { success: false, message: "Invalid token", details: err },
      403
    );
  }
  return await next();
});
