import { createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import invariant from "tiny-invariant";

const getPruefenStateCookie = () => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );

  return createCookie("pruefen_state", {
    path: "/",
    maxAge: 604_800 * 13, // 13 weeks (1/4 year)
    httpOnly: true,
    sameSite: "strict",
    secure: useSecureCookie,
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};
export const pruefenStateCookie = getPruefenStateCookie();
