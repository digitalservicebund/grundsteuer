import { createCookieSessionStorage } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import env from "~/env";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${useSecureCookie ? "__Host-" : ""}session`,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie,
    secrets: [env.SESSION_COOKIE_SECRET],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
