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
  MaskedInput,
  IntroText,
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
import { getSession } from "~/session.server";
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";

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
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (ericaRequestInProgress) {
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
          user.email,
          elsterRequestResultOrError.elsterRequestId
        );
        await deleteEricaRequestIdFscBeantragen(user.email);
      } else if (
        elsterRequestResultOrError?.errorType == "EricaUserInputError"
      ) {
        await deleteEricaRequestIdFscBeantragen(user.email);
        return {
          showError: true,
          showSpinner: false,
        };
      } else {
        await deleteEricaRequestIdFscBeantragen(user.email);
        throw new Error(elsterRequestResultOrError?.errorType);
      }
    }
  }

  return {
    showError: false,
    showSpinner: ericaRequestInProgress,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  await verifyCsrfToken(request, session);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (await isEricaRequestInProgress(userData)) return {};

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

  const normalizedSteuerId = steuerId.replace(/[\s/]/g, "");
  const normalizedGeburtsdatum = geburtsdatum.replace(/\s/g, "");

  const errors = {
    steuerId: await getErrorMessageForSteuerId(normalizedSteuerId),
    geburtsdatum: await getErrorMessageForGeburtsdatum(normalizedGeburtsdatum),
  };

  const errorsExist = errors.steuerId || errors.geburtsdatum;

  if (errorsExist) {
    return json({
      errors: removeUndefined(errors),
    });
  }

  const ericaRequestId = await requestNewFreischaltCode(
    normalizedSteuerId,
    normalizedGeburtsdatum
  );
  await saveEricaRequestIdFscBeantragen(user.email, ericaRequestId);

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
        fetcher.load("/fsc/beantragen?index");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <div className="lg:pr-[10%]">
      <ContentContainer size="sm" className="mb-80">
        <BreadcrumbNavigation />
        <Headline>Beantragen Sie Ihren persönlichen Freischaltcode.</Headline>

        <IntroText>
          Nur mit einem Freischaltcode können Sie Ihre Grundsteuererklärung nach
          Eingabe aller Daten absenden. Mit Eingabe des Codes bestätigen Sie
          Ihre Identität, das heißt: Wir wissen, dass keine andere Person
          widerrechtlich die Grundsteuererklärung abgibt.
        </IntroText>

        {showError && (
          <ErrorBar className="mb-32">
            Mit diesen Daten können wir keinen FSC beantragen.
          </ErrorBar>
        )}

        <Form method="post">
          <CsrfToken />
          <div>
            <FormGroup>
              <SteuerIdField
                name="steuerId"
                label="Steuer-Identifikationsnummer"
                placeholder="99 999 999 999"
                error={errors?.steuerId}
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
        imageAltText="Lohnsteuerbescheinigung"
        number="1"
        heading="Sie geben die Daten ein"
        text="Geben Sie Ihre Steuer-Identifikationsnummer und Ihr Geburtsdatum ein. Ihre Steuer-ID finden Sie zum Beispiel auf Ihren Steuerbescheiden, Lohnsteuerabrechnungen oder anderen Unterlagen vom Finanzamt."
        className="mb-24"
      />
      <EnumeratedCard
        image={fscLetterImage}
        imageAltText="Brief mit Freischaltcode"
        number="2"
        heading="Sie bekommen einen Brief vom Finanzamt"
        text="Der Freischaltcode wird von Ihrem technischen Finanzamt als Brief an Ihre Meldeadresse versendet. Dies dauert in der Regel 7 bis 14 Tage. Sie können aber schon vor dem Erhalt des Codes Ihre Grundsteuererklärung ausfüllen."
        className="mb-24"
      />
      <EnumeratedCard
        image={fscInputImage}
        imageAltText="Freischaltcode Eingabe"
        number="3"
        heading="Sie geben den Freischaltcode ein"
        text="Sobald Sie den Brief mit dem Freischaltcode erhalten haben, können Sie ihn hier hinterlegen und sind damit identifizeirt. Die Erklärung schicken Sie dann ab, wenn Sie sich bereit fühlen."
      />
    </div>
  );
}
