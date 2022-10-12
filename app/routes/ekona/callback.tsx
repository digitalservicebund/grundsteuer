import { ActionFunction, redirect, Session } from "@remix-run/node";
import { validateSamlResponse } from "~/ekona/saml.server";
import {
  destroyEkonaSession,
  getEkonaSession,
} from "~/ekona/ekonaCookie.server";
import { extractIdentData } from "~/ekona/validation.server";
import { findUserById, setUserIdentified, User } from "~/domain/user";
import invariant from "tiny-invariant";
import {
  AuditLogEvent,
  EkonaIdentifiedData,
  saveAuditLog,
} from "~/audit/auditLog";
import { revokeOutstandingFSCRequests } from "~/domain/lifecycleEvents.server";

const AUTHN_FAILED_STATUS_CODE =
  '<StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/>';
const USER_INTERRUPTION_MESSAGE =
  "Die ELSTER-seitige Authentifizierung wurde durch den Benutzer abgebrochen.";

const getUserFromEkonaSession = async (
  ekonaSession: Session
): Promise<User | null> => {
  if (!ekonaSession || !ekonaSession.get("userId")) {
    console.warn("Expected ekonaSession cookie containing userId");
    return null;
  }
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
    eventName: AuditLogEvent.IDENTIFIED_VIA_EKONA,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: userEmail,
    eventData: extractedData,
  });
};

// This happens mostly when the user navigates away from the elster login page using methods other than
// clicking the dedicated cancel button on the page (e.g. through the browser back button) and later triggers
// the creation of a fresh ekona cookie by visiting /ekona again (easiest way to reproduce: go to /ekona,
// click the "go to elster" button, click browser back, reload page, click the "go to elster" button). Starting
// ekona ident in this state leads to the ID in our own cookie not to match the one stored in the elster session
// cookie (i.e the cookie stored by the elster website), hence this (very frequent) error.
//
// This is a rather hacky solution designed around the assumption that the above-mentioned scenario constitutes
// almost all cases of this error on production.
const indicatesSessionDrift = (validationError: string) => {
  return validationError.toString().includes("InResponseTo is not valid");
};

const redirectIfUserInterruption = (validationError: any) => {
  if (
    indicatesSessionDrift(validationError) ||
    ("xmlStatus" in validationError &&
      validationError.xmlStatus.includes(AUTHN_FAILED_STATUS_CODE) &&
      validationError.xmlStatus.includes(USER_INTERRUPTION_MESSAGE))
  ) {
    return redirect("/ekona");
  }
  throw validationError;
};

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
  const body = await request.formData();
  const ekonaSession = await getEkonaSession(request.headers.get("Cookie"));
  const userData = await getUserFromEkonaSession(ekonaSession);
  if (!userData) {
    return redirect("/ekona");
  }

  let validatedResponse;
  try {
    validatedResponse = await validateSamlResponse(
      body.get("SAMLResponse") as string,
      ekonaSession
    );
  } catch (validationError) {
    return redirectIfUserInterruption(validationError);
  }
  invariant(
    validatedResponse?.profile,
    "Expected valid response to contain attribute profile"
  );
  const extractedData = extractIdentData(validatedResponse.profile);
  await setUserIdentified(userData.email);
  console.log(`User with id ${userData.id} identified via Ekona`);
  await saveAuditLogs(extractedData, clientIp, userData.email);
  await revokeOutstandingFSCRequests(userData);
  return redirect("/ekona/erfolgreich", {
    headers: {
      "Set-Cookie": await destroyEkonaSession(ekonaSession),
    },
  });
};

export default function Callback() {
  return null;
}
