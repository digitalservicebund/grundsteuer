import { Cookie, createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import invariant from "tiny-invariant";
import crypto from "crypto";
import { GrundModel } from "~/domain/steps";

const KEY_VERSION = "v01";
export const COOKIE_ENCODING = "base64";

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

type CreateFormDataCookieNameFunction = (options: {
  userId: string;
  index: number;
}) => string;

export const createFormDataCookieName: CreateFormDataCookieNameFunction = ({
  userId,
  index,
}) => {
  const cookieSuffix = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
    .slice(0, 32);
  return `${
    useSecureCookie ? "__Host-" : ""
  }form_data_${index}_${cookieSuffix}`;
};

type CreateFormDataCookieFunction = (options: {
  userId: string;
  index: number;
}) => Cookie;

export const createFormDataCookie: CreateFormDataCookieFunction = ({
  userId,
  index,
}) => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );
  const name = createFormDataCookieName({ userId, index });
  return createCookie(name, {
    path: "/",
    maxAge: 604_800 * 13, // 13 weeks (1/4 year)
    httpOnly: true,
    sameSite: "strict",
    secure: useSecureCookie,
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};

export const encryptCookie = (cookie: { userId: string; data: GrundModel }) => {
  const key = Buffer.from(process.env.FORM_COOKIE_ENC_SECRET as string);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const stringifiedData = JSON.stringify(cookie);
  const encryptedCookie = Buffer.concat([
    Buffer.from(KEY_VERSION),
    iv,
    cipher.update(stringifiedData),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  return encryptedCookie.toString(COOKIE_ENCODING);
};

export const decryptCookie = (
  encryptedCookie: Buffer
): { userId: string; data: GrundModel } => {
  const key = Buffer.from(process.env.FORM_COOKIE_ENC_SECRET as string);
  // ignoring key version for now since no key rotation is implemented
  const iv = encryptedCookie.subarray(3, 16 + 3);
  const ciphertext = encryptedCookie.subarray(
    16 + 3,
    encryptedCookie.length - 16
  );
  const authTag = encryptedCookie.subarray(encryptedCookie.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decryptedCookie = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return JSON.parse(decryptedCookie.toString("utf-8"));
};
