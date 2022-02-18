import { createCookie } from "remix";

import { GrundModel } from "~/domain/model";

export interface CookieData {
  records: GrundModel;
  allowedSteps?: string[];
}

export const formDataCookie = createCookie("form-data", { path: "/" });

export async function getFormDataCookie(request: Request): Promise<CookieData> {
  const cookieHeader = request.headers.get("Cookie");
  return (await formDataCookie.parse(cookieHeader)) || {};
}

export async function createResponseHeaders(
  cookieData: object
): Promise<Headers> {
  const headers = new Headers();
  const cookie = await formDataCookie.serialize(cookieData);
  headers.set("Set-Cookie", cookie);
  return headers;
}
