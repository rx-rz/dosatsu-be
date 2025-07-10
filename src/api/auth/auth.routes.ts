import { Hono } from "hono";
import { getCurrentSession, loginUser, logoutUser, registerUser } from "./auth.handlers.js";

export const authRouter =  new Hono()

authRouter.post('/register', ...registerUser)

authRouter.post('/login', ...loginUser)

authRouter.get('/session', ...getCurrentSession)

authRouter.post('/verify-email')

authRouter.post('/logout', ...logoutUser)

