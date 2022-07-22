import { ActionFunction, redirect, Session } from "@remix-run/node";
import { validateSamlResponse } from "~/ekona/saml.server";
import { getEkonaSession } from "~/ekonaCookies.server";
import { extractIdentData } from "~/ekona/validation";
import { findUserById, setUserIdentified } from "~/domain/user";
import invariant from "tiny-invariant";
import {
  AuditLogEvent,
  EkonaIdentifiedData,
  saveAuditLog,
} from "~/audit/auditLog";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

const getUserFromEkonaSession = async (ekonaSession: Session) => {
  invariant(
    ekonaSession.get("userId"),
    "Expected ekonaSession cookie to contain userId"
  );
  const userId = ekonaSession.get("userId");
  const user = await findUserById(userId);
  invariant(user, "Expected to find a user");
  return user;
};

const saveAuditLogs = async (
  extractedData: EkonaIdentifiedData,
  clientIp: string,
  userEmail: string
) => {
  await saveAuditLog({
    eventName: AuditLogEvent.FSC_ACTIVATED,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: userEmail,
    eventData: extractedData,
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const { clientIp } = context;
  const body = await request.formData();
  const ekonaSession = await getEkonaSession(request.headers.get("Cookie"));
  const user = await getUserFromEkonaSession(ekonaSession);
  const validatedResponse = await validateSamlResponse(
    body.get("SAMLResponse") as string,
    ekonaSession
  );
  invariant(
    validatedResponse.profile,
    "Expected valid response to contain attribute profile"
  );
  const extractedData = extractIdentData(validatedResponse.profile);
  await setUserIdentified(user.email, true);
  console.log(`User with id ${user.id} identified via Ekona`);
  await saveAuditLogs(extractedData, clientIp, user.email);

  return redirect("/ekona/erfolgreich");
};
