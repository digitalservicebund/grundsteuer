process.env.FORM_COOKIE_SECRET = "secret";

import { Session } from "@remix-run/server-runtime";
import { commitSession, getSession } from "~/session.server";
import { authenticator, SessionUser } from "~/auth.server";
import { GrundModel } from "~/domain/steps/index.server";
import { createHeadersWithFormDataCookie } from "~/formDataStorage.server";

jest.mock("~/auth.server", () => {
  return {
    __esModule: true,
    authenticator: {
      isAuthenticated: jest.fn(),
      authenticate: jest.fn(),
    },
  };
});

export const getAuthenticatedSession = async (email: string) => {
  const session = await getSession();
  session.set("user", { email: email, id: 1 });

  return session;
};

type IsAuthenticatedFunction = (
  request: Request | Session,
  options: {
    successRedirect?: never;
    failureRedirect: string;
  }
) => Promise<SessionUser>;

export const mockIsAuthenticated =
  authenticator.isAuthenticated as IsAuthenticatedFunction as jest.MockedFunction<IsAuthenticatedFunction>;

export const mockAuthenticate =
  authenticator.authenticate as jest.MockedFunction<
    typeof authenticator.authenticate
  >;

export const setCookieHeaderWithSessionAndData = async (
  email: string,
  formData: GrundModel,
  headers: Headers
) => {
  const authenticatedSessionCookie = await commitSession(
    await getAuthenticatedSession(email)
  );

  const dataHeaders = (await createHeadersWithFormDataCookie({
    user: {
      email,
      id: "1",
      identified: true,
      inDeclarationProcess: true,
    },
    data: formData,
  })) as Headers;

  // Move from Set-Cookie to Cookie header
  const regex = /, /g;
  const dataCookieHeader = (dataHeaders.get("Set-Cookie") || "").replace(
    regex,
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
  email: string,
  formData?: GrundModel,
  sessionData?: Record<string, any>
) => {
  let headers = new Headers();

  if (!formData) {
    const session = await getAuthenticatedSession(email);
    if (sessionData) {
      Object.entries(sessionData).forEach(([key, value]) => {
        session.set(key, value);
      });
    }
    const authenticatedSessionCookie = await commitSession(session);
    headers.set("Cookie", authenticatedSessionCookie);
  } else {
    headers = await setCookieHeaderWithSessionAndData(email, formData, headers);
  }

  return {
    request: new Request(`http://localhost${requestUrl}`, {
      headers: headers,
    }),
    params: {},
    context: { clientIp: "127.0.0.1", online: true },
  };
};
