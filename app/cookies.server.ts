import { Cookie, createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import invariant from "tiny-invariant";
import crypto from "crypto";
import { GrundModel } from "~/domain/steps/index.server";
import encryption from "./services/encryption";

export const COOKIE_ENCODING = "base64";

type PruefenCookieData = any;

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

export const encryptCookie = (data: any) => {
  const key = process.env.FORM_COOKIE_ENC_SECRET as string;
  const serializedData = Buffer.from(JSON.stringify(data), "utf-8");
  return encryption(key).encrypt(serializedData).toString(COOKIE_ENCODING);
};

export const decryptCookie = (encryptedData: Buffer) => {
  const key = process.env.FORM_COOKIE_ENC_SECRET as string;
  const decryptedData = encryption(key).decrypt(encryptedData);
  return JSON.parse(decryptedData.toString("utf-8"));
};
