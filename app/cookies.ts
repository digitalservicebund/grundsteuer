import { createCookie } from "remix";
import type { Records } from "~/domain/records";

export interface CookieData {
  records: Records;
}

export const formDataCookie = createCookie("form-data");

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
