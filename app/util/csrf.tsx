import { Session } from "@remix-run/node";
import { v4 as uuid } from "uuid";
import { getSession } from "~/session.server";

const SESSION_KEY = "csrf";

export const CsrfToken = (props: { value?: string }) => {
  if (!props.value) return null;
  return <input type="hidden" value={props.value} name="csrf" />;
};

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
