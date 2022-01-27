import { createCookie } from "remix";
import { TaxForm } from "./domain/tax-form";

export const formDataCookie = createCookie("form-data");

export async function getFormDataCookie(request: Request): Promise<TaxForm> {
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
