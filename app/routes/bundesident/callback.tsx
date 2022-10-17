import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import invariant from "tiny-invariant";
import { useId, BundesIdentIdentifiedData } from "~/useid/useid";
import { authenticator } from "~/auth.server";
import { findUserByEmail, setUserIdentified } from "~/domain/user";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { revokeOutstandingFSCRequests } from "~/domain/lifecycleEvents.server";
import { commitSession, getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit BundesId") };
};

const saveAuditLogs = async (
  extractedData: BundesIdentIdentifiedData,
  clientIp: string,
  userEmail: string
) => {
  await saveAuditLog({
    eventName: AuditLogEvent.IDENTIFIED_VIA_BUNDESIDENT,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: userEmail,
    eventData: extractedData,
  });
};

const getSessionId = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const sessionId = params.get("sessionId");
  console.log("PARAMS", JSON.stringify(params));
  invariant(sessionId, "sessionId was not given");
  return sessionId;
};

export const loader: LoaderFunction = async ({ context, request }) => {
  if (process.env.USE_USE_ID !== "true") {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  const userData = await findUserByEmail(user.email);
  invariant(userData, "should find user for user email");
  const sessionId = getSessionId(request);

  const identityData = await useId.getIdentityData(sessionId);

  await setUserIdentified(user.email);

  session.set("user", Object.assign(session.get("user"), { identified: true }));
  console.log(`User with id ${userData.id} identified via BundesIdent`);
  await saveAuditLogs(identityData, clientIp, userData.email);
  await revokeOutstandingFSCRequests(userData);

  return redirect("/bundesident/erfolgreich", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
