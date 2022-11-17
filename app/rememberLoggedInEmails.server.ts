import * as crypto from "crypto";
import { createCookie } from "@remix-run/node";
import { useSecureCookie } from "./util/useSecureCookie";
import { uniq } from "lodash";
import invariant from "tiny-invariant";

const COOKIE_NAME = "remember_logged_in_emails";

const getHashedEmail = (email: string) =>
  crypto.createHash("sha1").update(email).digest("hex");

const getRememberCookie = () => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );

  const MAX_AGE_IN_MONTHS = 4;

  return createCookie(COOKIE_NAME, {
    path: "/",
    maxAge: 24 * 60 * 60 * 30 * MAX_AGE_IN_MONTHS,
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie,
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};

export const appendEmailToRememberCookie = async (options: {
  email: string;
  cookieHeader: string | null;
}) => {
  const { email, cookieHeader } = options;
  // important: never store email in plain text, always hashed!
  const hashedEmail = crypto.createHash("sha1").update(email).digest("hex");
  const alreadyRememberedEmailHashes = await getRememberCookie().parse(
    cookieHeader
  );

  const newCookie = getRememberCookie().serialize;
  if (alreadyRememberedEmailHashes) {
    return newCookie(uniq([...alreadyRememberedEmailHashes, hashedEmail]));
  }
  return newCookie([hashedEmail]);
};

export const rememberCookieExists = async (options: {
  cookieHeader: string | null;
}) => {
  return Boolean(options.cookieHeader?.includes(COOKIE_NAME));
};

export const emailIsInRememberCookie = async (options: {
  email: string;
  cookieHeader: string | null;
}) => {
  const { email, cookieHeader } = options;
  const cookieContent = (await getRememberCookie().parse(cookieHeader)) || [];
  return cookieContent.includes(getHashedEmail(email.trim().toLowerCase()));
};
