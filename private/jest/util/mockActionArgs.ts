import { DataFunctionArgs } from "@remix-run/server-runtime";
import { setCookieHeaderWithSessionAndData } from "test/mocks/authenticationMocks";
import { GrundModel } from "~/domain/steps";

process.env.FORM_COOKIE_SECRET = "secret";

type MockActionArgsFunction = (options: {
  route?: string;
  formData?: Record<string, string>;
  context: { clientIp?: string };
  userEmail?: string;
  allData?: GrundModel;
  explicitCookie?: string;
}) => Promise<DataFunctionArgs>;

export const mockActionArgs: MockActionArgsFunction = async ({
  route,
  formData,
  context,
  userEmail,
  allData,
  explicitCookie,
}) => {
  let headers = new Headers();
  headers.append("content-type", "application/x-www-form-urlencoded");
  headers = await setCookieHeaderWithSessionAndData(
    userEmail || "",
    allData || {},
    headers
  );
  if (explicitCookie) {
    headers.set(
      "Cookie",
      (headers.get("Cookie") || "") + "; " + explicitCookie
    );
  }
  const request = new Request(`http://localhost${route || "/"}`, {
    method: "POST",
    headers,
  });
  if (formData) {
    const formDataObject = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObject.append(key, value);
    });
    request.formData = () => Promise.resolve(formDataObject);
  }
  return { request, context: { clientIp: context.clientIp || "" }, params: {} };
};
