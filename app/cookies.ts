import { createCookie } from "remix";

const formDataCookie = createCookie("form-data");

export async function getFormDataCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await formDataCookie.parse(cookieHeader)) || {};
}

export async function getFormDataCookieResponseHeader(cookieData: object) {
  return {
    "Set-Cookie": await formDataCookie.serialize(cookieData),
  };
}
