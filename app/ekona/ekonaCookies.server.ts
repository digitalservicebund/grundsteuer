import { createCookieSessionStorage } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${useSecureCookie ? "__Secure-" : ""}ekonaSession`,
    maxAge: 1800, //Restrict to 30 minutes (time limit of Ekona session)
    path: "/ekona",
    httpOnly: true,
    sameSite: "none", //We need to set sameSite none, because we explicitly want that this cookie is also sent with CrossSiteRequests
    secure: true,
    secrets: [process.env.SESSION_COOKIE_SECRET as string],
  },
});

export const {
  getSession: getEkonaSession,
  commitSession: commitEkonaSession,
  destroySession: destroyEkonaSession,
} = sessionStorage;
