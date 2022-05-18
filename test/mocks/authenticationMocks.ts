import { commitSession, getSession } from "~/session.server";
import { authenticator } from "~/auth.server";
import { GrundModel } from "~/domain/steps";
import { createHeadersWithFormDataCookie } from "~/formDataStorage.server";

jest.mock("~/auth.server", () => {
  return {
    __esModule: true,
    authenticator: {
      isAuthenticated: jest.fn(),
    },
  };
});

export const getAuthenticatedSession = async (userMail: string) => {
  const session = await getSession();
  session.set("user", { email: userMail, id: 1 });

  return session;
};

export const mockIsAuthenticated =
  authenticator.isAuthenticated as jest.MockedFunction<
    typeof authenticator.isAuthenticated
  >;

export const setCookieHeaderWithSessionAndData = async (
  userEmail: string,
  formData: GrundModel,
  headers: Headers
) => {
  const authenticatedSessionCookie = await commitSession(
    await getAuthenticatedSession(userEmail)
  );

  const dataHeaders = (await createHeadersWithFormDataCookie({
    user: { email: userEmail, id: "1", identified: true },
    data: formData,
  })) as Headers;

  // Move from Set-Cookie to Cookie header
  const dataCookieHeader = (dataHeaders.get("Set-Cookie") || "").replace(
    ", ",
    "; "
  );
  dataHeaders.delete("Set-Cookie");
  const fullCookieHeader = [authenticatedSessionCookie, dataCookieHeader].join(
    "; "
  );

  headers.set("Cookie", fullCookieHeader);
  return headers;
};

export const getLoaderArgsWithAuthenticatedSession = async (
  requestUrl: string,
  userEmail: string,
  formData?: GrundModel
) => {
  let headers = new Headers();

  if (!formData) {
    const authenticatedSessionCookie = await commitSession(
      await getAuthenticatedSession(userEmail)
    );
    headers.set("Cookie", authenticatedSessionCookie);
  } else {
    headers = await setCookieHeaderWithSessionAndData(
      userEmail,
      formData,
      headers
    );
  }

  return {
    request: new Request(requestUrl, {
      headers: headers,
    }),
    params: {},
    context: {},
  };
};
