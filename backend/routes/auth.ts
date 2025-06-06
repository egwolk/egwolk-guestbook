import { Hono } from "hono";
import { kindeClient, sessionManager } from "../kinde";
import { getUser } from "../kinde";

import { z } from "zod/v4";

const userSchema = z.object({
  picture: z.string().optional(),
  family_name: z.string().optional(),
  given_name: z.string().optional(),
  email: z.string().email(),
  id: z.string(),
  phone: z.string().optional(),
  preferred_username: z.string().min(3).max(32),
})



type User = z.infer<typeof userSchema>




export const authRoute = new Hono()
.get("/login", async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
})
.get("/register", async (c) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
})
.get("/callback", async (c) => {
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
})
.get("/logout", async (c) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
})
.get("/me", getUser ,async (c) => {
    const user = c.get('user') as User
    return c.json({ user })
}) 
