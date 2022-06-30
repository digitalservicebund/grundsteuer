import { Session } from "@remix-run/node";
import { v4 as uuid } from "uuid";
import { getSession } from "~/session.server";

export const SESSION_KEY = "csrf";
const TOKENS_TO_STORE_COUNT = 5;

export const CsrfToken = (props: { value?: string }) => {
  if (!props.value) return null;
  return <input type="hidden" value={props.value} name="csrf" />;
};

export const appendCsrfToken = (session: Session, token: string) => {
  let existingTokens: string[] = [];
  if (session.has(SESSION_KEY)) {
    const sessionContent = session.get(SESSION_KEY);
    try {
      existingTokens = JSON.parse(sessionContent);
    } catch {
      // old session cookie with single string csrf token
      existingTokens = [sessionContent];
    }
  }
  const newTokens = [token, ...existingTokens].splice(0, TOKENS_TO_STORE_COUNT);
  session.set(SESSION_KEY, JSON.stringify(newTokens));
};

export const createCsrfToken = (session: Session) => {
  const token = uuid();
  appendCsrfToken(session, token);
  return token;
};

export const formTokenIsValid = (session: Session, formToken: string) => {
  const sessionContent = session.get(SESSION_KEY);
  let tokens: string[] = [];
  try {
    tokens = JSON.parse(sessionContent);
  } catch {
    // old session cookie with single string csrf token
    tokens = [sessionContent];
  }
  return tokens.includes(formToken);
};

export const verifyCsrfToken = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.clone().formData();
  const formToken = formData.get(SESSION_KEY);

  // if the session doesn't have a csrf token, throw an error
  if (
    !session.has(SESSION_KEY) ||
    !formToken ||
    !formTokenIsValid(session, formToken as string)
  ) {
    throw new Response("Cannot verify CSRF token.", { status: 400 });
  }
};
