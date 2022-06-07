import React, { ReactNode } from "react";
import { Session } from "@remix-run/node";
import { v4 as uuid } from "uuid";
import { getSession } from "~/session.server";

export interface CsrfTokenProviderProps {
  children: ReactNode;
  token: string;
}

const SESSION_KEY = "csrf";
const context = React.createContext<string | null>(null);

export const CsrfTokenProvider = ({
  children,
  token,
}: CsrfTokenProviderProps): JSX.Element => {
  return <context.Provider value={token}>{children}</context.Provider>;
};

export const CsrfToken = (): JSX.Element => {
  const token = getCsrfToken();
  return (
    <input type="hidden" value={token as string | undefined} name="csrf" />
  );
};

function getCsrfToken() {
  return React.useContext(context);
}

export const createCsrfToken = (session: Session) => {
  const token = uuid();
  session.set(SESSION_KEY, token);
  return token;
};

export const verifyCsrfToken = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.clone().formData();
  const formToken = formData.get(SESSION_KEY);

  // if the session doesn't have a csrf token, throw an error
  if (
    !session.has(SESSION_KEY) ||
    !formToken ||
    session.get(SESSION_KEY) !== formToken
  ) {
    throw new Response("Cannot verify CSRF token.", { status: 400 });
  }
};
