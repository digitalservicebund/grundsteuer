import invariant from "tiny-invariant";
import { createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/storage/useSecureCookie";
import {
  COOKIE_ENCODING,
  decryptCookie,
  encryptCookie,
  PruefenCookieData,
} from "~/storage/cookies.server";

const getPruefenStateCookie = () => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );

  return createCookie("pruefen_state", {
    path: "/",
    maxAge: 604_800 * 13, // 13 weeks (1/4 year)
    httpOnly: true,
    sameSite: "lax",
    secure: useSecureCookie,
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};
const pruefenStateCookie = getPruefenStateCookie();

export const saveToPruefenStateCookie = (data: PruefenCookieData) => {
  const encryptedData = encryptCookie(data);
  return pruefenStateCookie.serialize(encryptedData);
};

export const getFromPruefenStateCookie = async (
  cookieHeader: string | null
) => {
  const cookieContent = await pruefenStateCookie.parse(cookieHeader);
  if (!cookieContent) return null;
  try {
    return decryptCookie(Buffer.from(cookieContent, COOKIE_ENCODING));
  } catch (error) {
    console.warn(error);
    return {};
  }
};
