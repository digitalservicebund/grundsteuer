import { createCookie } from "remix";

const formDataCookie = createCookie("form-data");

export async function getFormDataCookie(request: Request): Promise<object> {
  const cookieHeader = request.headers.get("Cookie");
  return (await formDataCookie.parse(cookieHeader)) || {};
}

export async function getFormDataCookieResponseHeader(
  cookieData: object
): Promise<Record<string, string>> {
  return {
    "Set-Cookie": await formDataCookie.serialize(cookieData),
  };
}
