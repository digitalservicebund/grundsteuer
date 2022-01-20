import { createCookie } from "remix";

export const formDataCookie = createCookie("form-data");

export async function getFormDataCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await formDataCookie.parse(cookieHeader)) || {};
}
