import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import invariant from "tiny-invariant";
import { useId, BundesIdentIdentifiedData } from "~/useid/useid";
import { authenticator } from "~/auth.server";
import { findUserByEmail, setUserIdentified } from "~/domain/user";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import { revokeOutstandingFSCRequests } from "~/domain/lifecycleEvents.server";
import { commitSession, getSession } from "~/session.server";
import { Button, ContentContainer, Headline, IntroText } from "~/components";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit BundesId") };
};

const saveAuditLogs = async (
  extractedData: BundesIdentIdentifiedData,
  clientIp: string,
  userEmail: string
) => {
  await saveAuditLog({
    eventName: AuditLogEvent.IDENTIFIED_VIA_BUNDES_IDENT,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: userEmail,
    eventData: extractedData,
  });
};

const getSessionId = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const sessionId = params.get("sessionId");
  invariant(sessionId, "sessionId was not given");
  return sessionId;
};

const checkIfErrorState = (request: Request) => {
  const params = new URL(request.url).searchParams;
  const resultStatus = params.get("ResultMajor");
  if (resultStatus != "ok") {
    console.log(
      `BundesIdent error occurred. ResultMajor: ${resultStatus} ResultMinor: ${params.get(
        "ResultMinor"
      )}`
    );
    return { errorState: true };
  }
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

  const errorState = checkIfErrorState(request);
  if (errorState) return errorState;

  const sessionId = getSessionId(request);
  const identityData = await useId.getIdentityData(sessionId);

  await setUserIdentified(user.email);

  session.set("user", Object.assign(session.get("user"), { identified: true }));
  console.log(`User with id ${userData.id} identified via BundesIdent`);
  await saveAuditLogs(identityData, clientIp, userData.email);
  await revokeOutstandingFSCRequests(userData);

  return redirect("/bundesIdent/erfolgreich", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function BundesIdentCallback() {
  return (
    <div className="mt-16 sm:mt-32">
      <ContentContainer size="sm">
        <Headline>Das hat leider nicht geklappt</Headline>
        <IntroText>Bitte versuchen Sie es erneut.</IntroText>
        <Button to="/bundesIdent?errorState=true">
          Zurück zur Identifikation
        </Button>
      </ContentContainer>
    </div>
  );
}
