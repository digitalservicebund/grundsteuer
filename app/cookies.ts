import { createCookie } from "@remix-run/node";

export const pruefenStateCookie = createCookie("pruefen_state", {
  maxAge: 604_800, // one week
});
