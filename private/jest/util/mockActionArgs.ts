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
}) => Promise<DataFunctionArgs>;

export const mockActionArgs: MockActionArgsFunction = async ({
  route,
  formData,
  context,
  userEmail,
  allData,
}) => {
  let headers = new Headers();
  headers.append("content-type", "application/x-www-form-urlencoded");
  headers = await setCookieHeaderWithSessionAndData(
    userEmail || "",
    allData || {},
    headers
  );
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
