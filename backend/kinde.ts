import {createKindeServerClient, GrantType, type SessionManager, type UserType} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import {  createMiddleware } from 'hono/factory'

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

let store: Record<string, unknown> = {};

export const sessionManager =(c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
    } as const;
    if (typeof value === 'string') {
        setCookie(c, key, value, cookieOptions);
    } else {
        setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "refresh_token", "kinde_session"].forEach((key) => {
        deleteCookie(c, key);
    });
  }
})

type Env = {
  Variables: {
    user: UserType
  }
}


// export const getUser = createMiddleware<Env>(async (c, next) => {
//   try {
//     const manager = sessionManager(c)
//     const isAuthenticated = await kindeClient.isAuthenticated(manager)
//     if (!isAuthenticated) {
//         return c.json({ error: "Not authenticated" }, 401)
//     }
//     const user = await kindeClient.getUserProfile(manager)
//     c.set('user', user)
//     await next()
//   } catch (e) {
//     console.error(e)
//     return c.json({ error: "Not authenticated" }, 401)
//   }
// })


//for testing purposes only, to allow Bearer token in Authorization header
 export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    let manager = sessionManager(c);

    // Check for Bearer token in Authorization header
    const authHeader = c.req.header("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Override getSessionItem to return the token for 'access_token'
      manager = {
        ...manager,
        async getSessionItem(key: string) {
          if (key === "access_token") return token;
          return getCookie(c, key);
        }
      };
    }

    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ error: "Not authenticated" }, 401);
    }
    const user = await kindeClient.getUserProfile(manager);
    c.set('user', user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: "Not authenticated" }, 401);
  }
})
