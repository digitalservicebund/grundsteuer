import { ActionFunction, json, redirect, Session } from "@remix-run/node";
import { validateSamlResponse } from "~/ekona/saml.server";
import { getEkonaSession } from "~/ekonaCookies.server";
import { extractIdentData } from "~/ekona/validation";
import { findUserById, setUserIdentified, User } from "~/domain/user";
import invariant from "tiny-invariant";
import {
  AuditLogEvent,
  EkonaIdentifiedData,
  saveAuditLog,
} from "~/audit/auditLog";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import {
  handleFscRevocationInProgress,
  isEricaRevocationRequestInProgress,
  revokeFsc,
} from "~/routes/fsc/eingeben";
import Spinner from "~/components/Spinner";
import { BreadcrumbNavigation, ContentContainer } from "~/components";
import { useEffect, useState } from "react";
import { useActionData, useFetcher } from "@remix-run/react";

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
  const ericaRevocationRequestIsInProgress =
    await isEricaRevocationRequestInProgress(userData);
  if (!ericaRevocationRequestIsInProgress) {
    const validatedResponse = await validateSamlResponse(
      body.get("SAMLResponse") as string,
      ekonaSession
    );
    invariant(
      validatedResponse.profile,
      "Expected valid response to contain attribute profile"
    );
    const extractedData = extractIdentData(validatedResponse.profile);
    await setUserIdentified(userData.email, true);
    console.log(`User with id ${userData.id} identified via Ekona`);
    await saveAuditLogs(extractedData, clientIp, userData.email);
    await revokeOutstandingFSCRequests(userData);
  } else {
    // We only try to revocate. If it does not succeed, we do not want to show an error to the user
    const revocationResult = await handleFscRevocationInProgress(
      userData,
      clientIp,
      `FSC revoked after Ekone identification for user with id ${userData.id}`
    );
    if (revocationResult && "finished" in revocationResult)
      return redirect("/ekona/erfolgreich");
    return json({
      showError: false,
      showSpinner: ericaRevocationRequestIsInProgress,
    });
  }
  return redirect("/ekona/erfolgreich");
};

export default function FscEingeben() {
  const actionData = useActionData();

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();

  const [showSpinner, setShowSpinner] = useState(actionData?.showSpinner);
  useEffect(() => {
    if (fetcher.data) {
      setShowSpinner(fetcher.data.showSpinner);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (actionData) {
      setShowSpinner(actionData.showSpinner);
    }
  }, [actionData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showSpinner) {
        fetcher.submit({}, { method: "post" });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />

      {showSpinner && (
        <Spinner
          initialText={"Ihre Anfrage wird überprüft."}
          waitingText={
            "Das Überprüfen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
          }
          longerWaitingText={
            "Wir überprüfen weiter Ihre Anfrage. Bitte verlassen Sie diese Seite nicht."
          }
        />
      )}
    </ContentContainer>
  );
}
