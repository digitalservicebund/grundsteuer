import { createCookieSessionStorage, Session } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import {
  COOKIE_ENCODING,
  decryptCookie,
  encryptCookie,
} from "~/cookies.server";

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

export const getEkonaSession = (cookieHeader: string | null) => {
  return sessionStorage.getSession(cookieHeader, {
    decode: (ciphertext) => {
      return decryptCookie(Buffer.from(ciphertext, COOKIE_ENCODING));
    },
  });
};

export const commitEkonaSession = (session: Session) => {
  return sessionStorage.commitSession(session, {
    encode: (plaintext) => {
      return encryptCookie(plaintext);
    },
  });
};

export const destroyEkonaSession = sessionStorage.destroySession;
