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
    const formDataObject = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObject.append(key, formData[key]);
    });
    request.formData = () => Promise.resolve(formDataObject);
  }
  return { request, context: null, params: {} };
};
