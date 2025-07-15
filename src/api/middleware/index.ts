import { getCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import type { JwtTokenExpired } from "hono/utils/jwt/types";
import type { MiddlewareHandler } from "hono";

export type JWTPayload = {
  account_id: string;
  email: string;
  name: string;
  exp: number;
  is_verified: boolean;
};

export const requireAuth: MiddlewareHandler = createMiddleware(
  async (c, next) => {
    const cookieToken = getCookie(c, "dosatsu_access_token");
    const headerToken = c.req.header("Authorization");

    const token =
      (headerToken?.startsWith("Bearer ") && headerToken.split(" ")[1]) ||
      (cookieToken?.startsWith("Bearer ") && cookieToken.split(" ")[1]);

    if (!token) {
      deleteCookie(c, "access_token");
      return c.json(
        { success: false, message: "Authentication required", details: null },
        401
      );
    }

    try {
      const payload = (await verify(
        token,
        process.env.JWT_SECRET ?? ""
      )) as JWTPayload;

      c.set("jwt_payload", payload);
      await next();
    } catch (err) {
      const isExpired = (err as JwtTokenExpired)?.name === "JwtTokenExpired";

      deleteCookie(c, "access_token");

      return c.json(
        {
          success: false,
          message: isExpired ? "Token expired" : "Invalid or malformed token",
          details: err,
        },
        isExpired ? 401 : 403
      );
    }
  }
);
