import { createCookieSessionStorage } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${useSecureCookie ? "__Host-" : ""}session`,
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: useSecureCookie,
    secrets: [process.env.SESSION_COOKIE_SECRET as string],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
