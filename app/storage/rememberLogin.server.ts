import { createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/storage/useSecureCookie";

const COOKIE_NAME = "login";

const getRememberCookie = () => {
  const MAX_AGE_IN_MONTHS = 7;

  return createCookie(COOKIE_NAME, {
    path: "/",
    maxAge: 24 * 60 * 60 * 30 * MAX_AGE_IN_MONTHS,
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie,
  });
};

export const rememberCookie = () => {
  return getRememberCookie().serialize(1);
};

export const rememberCookieExists = async (options: {
  cookieHeader: string | null;
}) => {
  return Boolean(options.cookieHeader?.includes(COOKIE_NAME));
};
