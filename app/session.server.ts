import { createCookieSessionStorage } from "remix";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: ["staging", "production"].includes(process.env.APP_ENV as string),
    secrets: [process.env.SESSION_COOKIE_SECRET as string],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
