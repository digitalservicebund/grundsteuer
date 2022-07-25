import { ActionFunction, redirect, Session } from "@remix-run/node";
import { validateSamlResponse } from "~/ekona/saml.server";
import { getEkonaSession } from "~/ekona/ekonaCookies.server";
import { extractIdentData } from "~/ekona/validation";
import {
  deleteEricaRequestIdFscStornieren,
  findUserById,
  setUserIdentified,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import {
  AuditLogEvent,
  EkonaIdentifiedData,
  saveAuditLog,
} from "~/audit/auditLog";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { revokeFsc } from "~/routes/fsc/eingeben";

const AUTHN_FAILED_STATUS_CODE =
  '<StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"/>';
const USER_INTERRUPTION_MESSAGE =
  "Die ELSTER-seitige Authentifizierung wurde durch den Benutzer abgebrochen.";

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

const revokeOutstandingFSCRequests = async (user: User) => {
  if (user.fscRequest) {
    await revokeFsc(user);
  }
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

const redirectIfUserInterruption = (validationError: any) => {
  if (
    "xmlStatus" in validationError &&
    validationError.xmlStatus.includes(AUTHN_FAILED_STATUS_CODE) &&
    validationError.xmlStatus.includes(USER_INTERRUPTION_MESSAGE)
  ) {
    return redirect("/ekona");
  }
  throw validationError;
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
  const userData = await getUserFromEkonaSession(ekonaSession);
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
  await setUserIdentified(userData.email, true);
  console.log(`User with id ${userData.id} identified via Ekona`);
  await saveAuditLogs(extractedData, clientIp, userData.email);
  await revokeOutstandingFSCRequests(userData);
  await deleteEricaRequestIdFscStornieren(userData.email);
  return redirect("/ekona/erfolgreich");
};
