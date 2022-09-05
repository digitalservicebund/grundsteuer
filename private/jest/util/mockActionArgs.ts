process.env.FORM_COOKIE_SECRET = "secret";
process.env.FORM_COOKIE_ENC_SECRET = "26d011bcbb9db8c4673b7fcd90c9ec6d";

import { DataFunctionArgs } from "@remix-run/server-runtime";
import { setCookieHeaderWithSessionAndData } from "test/mocks/authenticationMocks";
import { GrundModel } from "~/domain/steps/index.server";

type MockActionArgsFunction = (options: {
  route?: string;
  formData?: Record<string, string>;
  context: { clientIp?: string };
  email?: string;
  allData?: GrundModel;
  explicitCookie?: string;
}) => Promise<DataFunctionArgs>;

export const mockActionArgs: MockActionArgsFunction = async ({
  route,
  formData,
  context,
  email,
  allData,
  explicitCookie,
}) => {
  let headers = new Headers();
  headers.append("content-type", "application/x-www-form-urlencoded");
  headers = await setCookieHeaderWithSessionAndData(
    email || "",
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
  const formDataObject = new FormData();
  Object.entries(formData || {}).forEach(([key, value]) => {
    formDataObject.append(key, value);
  });
  request.formData = () => Promise.resolve(formDataObject);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  request.clone = () => ({ formData: () => Promise.resolve(formDataObject) });

  return {
    request,
    context: { clientIp: context.clientIp || "", online: true },
    params: {},
  };
};
