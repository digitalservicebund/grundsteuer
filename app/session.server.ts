import { createCookieSessionStorage } from "remix";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: ["staging", "production"].includes(process.env.APP_ENV as string),
    secrets: ["s3cr3t"], // TODO: replace this with an actual secret
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
