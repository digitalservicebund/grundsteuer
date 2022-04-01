import { DataFunctionArgs } from "@remix-run/server-runtime";

type MockActionArgsFunction = (options: {
  formData?: Record<string, string>;
}) => DataFunctionArgs;

export const mockActionArgs: MockActionArgsFunction = ({ formData }) => {
  const headers = new Headers();
  headers.append("content-type", "application/x-www-form-urlencoded");
  const request = new Request("/", {
    method: "POST",
    headers,
  });
  if (formData) {
    request.formData = () =>
      Promise.resolve({
        get: function (name) {
          return formData[name];
        },
      } as FormData);
  }
  return { request, context: null, params: {} };
};
