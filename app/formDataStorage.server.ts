import { createCookie } from "remix";
import invariant from "tiny-invariant";
import { GrundModel } from "~/domain/steps";
import { SessionUser } from "./auth.server";

export const createFormDataCookie = (userId: string) => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );
  const name = `_form_data_${userId.slice(0, 8)}`;
  return createCookie(name, {
    path: "/",
    maxAge: 604_800 * 4, // 4 weeks
    httpOnly: true,
    sameSite: "strict",
    secure: ["staging", "production"].includes(process.env.APP_ENV as string),
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};

type GetStoredFormDataFunction = (options: {
  request: Request;
  user: SessionUser;
}) => Promise<GrundModel>;

export const getStoredFormData: GetStoredFormDataFunction = async ({
  request,
  user,
}) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await createFormDataCookie(user.id).parse(cookieHeader);
  if (cookie?.userId === user.id) {
    return cookie.data || {};
  }
  return {};
};

type CommitFormDataToStorageFunction = (options: {
  data: GrundModel;
  user: SessionUser;
}) => Promise<string>;

export const commitFormDataToStorage: CommitFormDataToStorageFunction = async ({
  data,
  user,
}) => {
  const cookieData = {
    userId: user.id,
    data,
  };
  const cookie = await createFormDataCookie(user.id).serialize(cookieData);
  return cookie;
};
