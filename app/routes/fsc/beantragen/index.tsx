import { useEffect, useState } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Headline,
  IntroText,
  MaskedInput,
  Spinner,
} from "~/components";
import {
  requestNewFreischaltCode,
  retrieveAntragsId,
} from "~/erica/freischaltCodeBeantragen";

import {
  deleteEricaRequestIdFscBeantragen,
  findUserByEmail,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { removeUndefined } from "~/util/removeUndefined";
import {
  getErrorMessageForGeburtsdatum,
  getErrorMessageForSteuerId,
} from "~/domain/validation";
import SteuerIdField from "~/components/form/SteuerIdField";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import EnumeratedCard from "~/components/EnumeratedCard";
import lohnsteuerbescheinigungImage from "~/assets/images/lohnsteuerbescheinigung_idnr.svg";
import fscLetterImage from "~/assets/images/fsc-letter.svg";
import fscInputImage from "~/assets/images/fsc-input.svg";
import ErrorBar from "~/components/ErrorBar";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { getRedirectionParams } from "~/routes/fsc/index";

const isEricaRequestInProgress = async (userData: User) => {
  return Boolean(userData.ericaRequestIdFscBeantragen);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return Boolean(userData.fscRequest);
};

const getEricaRequestIdFscBeantragen = async (userData: User) => {
  invariant(
    userData.ericaRequestIdFscBeantragen,
    "ericaRequestIdFscBeantragen is null"
  );
  return userData.ericaRequestIdFscBeantragen;
};

export const handleFscRequestInProgress = async (
  userData: User,
  clientIp: string
) => {
  const elsterRequestResultOrError = await retrieveAntragsId(
    await getEricaRequestIdFscBeantragen(userData)
  );
  if (elsterRequestResultOrError) {
    if ("elsterRequestId" in elsterRequestResultOrError) {
      await saveAuditLog({
        eventName: AuditLogEvent.FSC_REQUESTED,
        timestamp: Date.now(),
        ipAddress: clientIp,
        username: userData.email,
        eventData: {
          transferticket: elsterRequestResultOrError.transferticket,
          steuerId: elsterRequestResultOrError.taxIdNumber,
        },
      });
      await saveFscRequest(
        userData.email,
        elsterRequestResultOrError.elsterRequestId
      );
      await deleteEricaRequestIdFscBeantragen(userData.email);
    } else if (elsterRequestResultOrError?.errorType == "EricaUserInputError") {
      await deleteEricaRequestIdFscBeantragen(userData.email);
      return {
        showError: true,
        showSpinner: false,
      };
    } else {
      await deleteEricaRequestIdFscBeantragen(userData.email);
      throw new Error(
        `${elsterRequestResultOrError?.errorType}: ${elsterRequestResultOrError?.errorMessage}`
      );
    }
  }
};

export const getBeantragenData = async (request: Request) => {
  const formData = await request.formData();
  const steuerId = formData.get("steuerId");
  const geburtsdatum = formData.get("geburtsdatum");

  invariant(
    typeof steuerId === "string",
    "expected formData to include steuerId field of type string"
  );
  invariant(
    typeof geburtsdatum === "string",
    "expected formData to include geburtsdatum field of type string"
  );
  return {
    steuerId,
    geburtsdatum,
  };
};

export const validateBeantragenData = async ({
  steuerId,
  geburtsdatum,
}: {
  steuerId: string;
  geburtsdatum: string;
}) => {
  const errors = {
    steuerId: await getErrorMessageForSteuerId(steuerId),
    geburtsdatum: await getErrorMessageForGeburtsdatum(geburtsdatum),
  };

  const errorsExist = errors.steuerId || errors.geburtsdatum;

  if (errorsExist) {
    return {
      errors: removeUndefined(errors),
    };
  }
};

export const requestNewFsc = async (
  normalizedSteuerId: string,
  normalizedGeburtsdatum: string,
  email: string
) => {
  const ericaRequestId = await requestNewFreischaltCode(
    normalizedSteuerId,
    normalizedGeburtsdatum
  );
  await saveEricaRequestIdFscBeantragen(email, ericaRequestId);
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  const ericaRequestInProgress = await isEricaRequestInProgress(userData);

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect(
      "/fsc/beantragen/erfolgreich" + getRedirectionParams(request.url)
    );
  }

  if (ericaRequestInProgress) {
    const fscRequestData = await handleFscRequestInProgress(userData, clientIp);
    if (fscRequestData) {
      return fscRequestData;
    }
  }

  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = createCsrfToken(session);

  return json(
    {
      showError: false,
      showSpinner: ericaRequestInProgress,
      csrfToken,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  await verifyCsrfToken(request);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect(
      "/fsc/beantragen/erfolgreich" + getRedirectionParams(request.url)
    );
  }

  if (await isEricaRequestInProgress(userData)) return {};

  const formData = await getBeantragenData(request);
  const normalizedSteuerId = formData.steuerId.replace(/[\s/]/g, "");
  const normalizedGeburtsdatum = formData.geburtsdatum.replace(/\s/g, "");
  const validationErrors = await validateBeantragenData({
    steuerId: normalizedSteuerId,
    geburtsdatum: normalizedGeburtsdatum,
  });
  if (validationErrors) return validationErrors;
  await requestNewFsc(
    normalizedSteuerId,
    normalizedGeburtsdatum,
    userData.email
  );
  return {};
};

export default function FscBeantragen() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  const [showSpinner, setShowSpinner] = useState(loaderData?.showSpinner);
  const [showError, setShowError] = useState(loaderData?.showError);
  const [redirectionParams, setRedirectionParams] = useState("");

  useEffect(() => {
    setRedirectionParams(getRedirectionParams(window.location.href, true));
  });

  useEffect(() => {
    if (fetcher.data) {
      setShowSpinner(fetcher.data.showSpinner);
      setShowError(fetcher.data.showError);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (loaderData) {
      setShowSpinner(loaderData.showSpinner);
      setShowError(loaderData.showError);
    }
  }, [loaderData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showSpinner) {
        fetcher.load("/fsc/beantragen?index" + redirectionParams);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <div className="lg:pr-[10%]">
      <ContentContainer size="sm-md" className="mb-80">
        <BreadcrumbNavigation />
        <Headline>Beantragen Sie Ihren persönlichen Freischaltcode.</Headline>

        <IntroText>
          Nur mit einem Freischaltcode können Sie Ihre Grundsteuererklärung nach
          Eingabe aller Daten absenden. Wir benötigen Ihre
          Steuer-Identifikationsnummer und Geburtsdatum um Sie eindeutig zu
          identifizieren.
        </IntroText>

        <IntroText>
          Der Freischaltcode wird von Ihrem technischen Finanzamt als Brief an
          Ihre Meldeadresse versendet. Dies dauert in der Regel 7 bis 14 Tage.
          Sie können aber schon vor dem Erhalt des Codes Ihre
          Grundsteuererklärung ausfüllen.
        </IntroText>

        {showError && !isSubmitting && (
          <ErrorBar className="mb-32">
            Mit diesen Daten können wir keinen Freischaltcode beantragen.
          </ErrorBar>
        )}

        <Form
          method="post"
          action={"/fsc/beantragen?index" + redirectionParams}
        >
          <CsrfToken value={loaderData.csrfToken} />
          <div>
            <FormGroup>
              <SteuerIdField
                name="steuerId"
                label="Steuer-Identifikationsnummer"
                placeholder="11 111 111 111"
                error={errors?.steuerId}
                help={
                  <p>
                    Schauen Sie dafür auf Ihren letzten Einkommensteuerbescheid
                    oder suchen Sie in Ihren Unterlagen nach einem Brief vom
                    Bundeszentralamt für Steuern. Die 11-stellige Nummer steht
                    oben rechts groß auf dem Brief.
                  </p>
                }
              />
            </FormGroup>
            <FormGroup>
              <MaskedInput
                mask="Date"
                name="geburtsdatum"
                label="Geburtsdatum"
                placeholder="TT.MM.JJJJ"
                error={errors?.geburtsdatum}
                className="w-1/2"
              />
            </FormGroup>
          </div>
          <ButtonContainer>
            <Button disabled={isSubmitting || showSpinner}>
              Freischaltcode beantragen
            </Button>
            <Button look="secondary" to="/formular/welcome">
              Später beantragen
            </Button>
          </ButtonContainer>
        </Form>
        {showSpinner && (
          <Spinner
            initialText={"Ihr Freischaltcode wird beantragt."}
            waitingText={
              "Das Beantragen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
            }
            longerWaitingText={
              "Wir beantragen weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
            }
          />
        )}
      </ContentContainer>
      <h2 className="text-24 mb-24">Wie beantrage ich den Freischaltcode?</h2>
      <EnumeratedCard
        image={lohnsteuerbescheinigungImage}
        imageAltText="Bildbeispiel einer Lohnsteuerbescheinigung"
        number="1"
        heading="Sie geben die Daten ein"
        text="Geben Sie Ihre Steuer-Identifikationsnummer und Ihr Geburtsdatum ein. Ihre Steuer-ID finden Sie zum Beispiel auf Ihren Steuerbescheiden, Lohnsteuerabrechnungen oder anderen Unterlagen vom Finanzamt."
        className="mb-16"
      />
      <EnumeratedCard
        image={fscLetterImage}
        imageAltText="Bildbeispiel des Freischaltcode Brief"
        number="2"
        heading="Sie bekommen einen Brief vom Finanzamt"
        text="Der Freischaltcode wird von Ihrem technischen Finanzamt als Brief an Ihre Meldeadresse versendet. Dies dauert in der Regel 7 bis 14 Tage. Sie können aber schon vor dem Erhalt des Codes Ihre Grundsteuererklärung ausfüllen."
        className="mb-16"
      />
      <EnumeratedCard
        image={fscInputImage}
        imageAltText="Bildbeispiel der Eingabe des Freischaltcode"
        number="3"
        heading="Sie geben den Freischaltcode ein"
        text="Sobald Sie den Brief mit dem Freischaltcode erhalten haben, können Sie ihn hier hinterlegen und sind damit identifiziert. Im Anschluss können Sie eine vollständig ausgefüllte Erklärung abschicken."
      />
    </div>
  );
}
