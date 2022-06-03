import { createCookie } from "@remix-run/node";

export const pruefenCookie = createCookie("pruefen", {
  maxAge: 604_800, // one week
});

export const pruefenStateCookie = createCookie("pruefen_state", {
  maxAge: 604_800, // one week
});
