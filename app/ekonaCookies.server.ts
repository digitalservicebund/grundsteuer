import { createCookieSessionStorage } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${useSecureCookie ? "__Host-" : ""}ekonaSession`,
    maxAge: 1800, //Restrict to 30 minutes (time limit of Ekona session)
    path: "/ekona",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    secrets: [process.env.SESSION_COOKIE_SECRET as string],
  },
});

export const {
  getSession: getEkonaSession,
  commitSession: commitEkonaSession,
  destroySession: destroyEkonaSession,
} = sessionStorage;
