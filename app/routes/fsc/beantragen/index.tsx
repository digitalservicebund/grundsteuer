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
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { removeUndefined } from "~/util/removeUndefined";
import SteuerIdField from "~/components/form/SteuerIdField";
import EnumeratedCard from "~/components/EnumeratedCard";
import lohnsteuerbescheinigungImage from "~/assets/images/lohnsteuerbescheinigung_idnr.svg";
import fscLetterImage from "~/assets/images/fsc-letter.svg";
import fscInputImage from "~/assets/images/fsc-input.svg";
import ErrorBar from "~/components/ErrorBar";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import Hint from "~/components/Hint";
import steuerIdImg from "~/assets/images/help/help-steuer-id.png";
import {
  getErrorMessageForGeburtsdatum,
  getErrorMessageForSteuerId,
} from "~/domain/validation/fscValidation";
import { saveSuccessfulFscRequestData } from "~/domain/lifecycleEvents.server";
import { ericaUtils } from "~/erica/utils";
import { fetchInDynamicInterval, IntervalInstance } from "~/routes/fsc/_utils";

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

// This function would return an error if the request could not be found.
// An update of the database through another process would not affect this error.
export const handleFscRequestInProgress = async (
  userData: User,
  clientIp: string,
  successLoggingMessage?: string
) => {
  const ericaRequestId = await getEricaRequestIdFscBeantragen(userData);
  const elsterRequestResultOrError = await retrieveAntragsId(ericaRequestId);
  if (elsterRequestResultOrError) {
    if ("elsterRequestId" in elsterRequestResultOrError) {
      await saveSuccessfulFscRequestData(
        userData.email,
        ericaRequestId,
        clientIp,
        elsterRequestResultOrError.elsterRequestId,
        elsterRequestResultOrError.transferticket,
        elsterRequestResultOrError.taxIdNumber
      );
      console.log(`${successLoggingMessage}`);
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
  email: string,
  clientIp: string
) => {
  const ericaRequestIdOrError = await requestNewFreischaltCode(
    normalizedSteuerId,
    normalizedGeburtsdatum
  );
  if ("location" in ericaRequestIdOrError) {
    await saveEricaRequestIdFscBeantragen(
      email,
      ericaRequestIdOrError.location
    );
    await ericaUtils.setClientIpForEricaRequest(
      ericaRequestIdOrError.location,
      clientIp
    );
  } else {
    return ericaRequestIdOrError.error;
  }
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
    const fscRequestData = await handleFscRequestInProgress(
      userData,
      clientIp,
      `FSC requested for user with id ${userData.id}`
    );
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

type BeantragenActionData = {
  ericaApiError?: string;
  startTime?: number;
  errors?: Record<string, string>;
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<BeantragenActionData | Response> => {
  const { clientIp } = context;
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
    return redirect("/fsc/beantragen/erfolgreich");
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
  const ericaApiError = await requestNewFsc(
    normalizedSteuerId,
    normalizedGeburtsdatum,
    userData.email,
    clientIp
  );
  if (ericaApiError) {
    return { ericaApiError };
  }
  return {
    startTime: Date.now(),
  };
};

export default function FscBeantragen() {
  const loaderData = useLoaderData();
  const actionData: BeantragenActionData | undefined = useActionData();
  const errors = actionData?.errors;
  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  const [showSpinner, setShowSpinner] = useState(loaderData?.showSpinner);
  const [showError, setShowError] = useState(loaderData?.showError);
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [startTime, setStartTime] = useState(
    actionData?.startTime || Date.now()
  );

  useEffect(() => {
    if (actionData?.startTime) {
      setStartTime(actionData.startTime);
    }
  }, [actionData]);

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
    const interval: IntervalInstance = { timer: null, stoppedFetching: false };
    interval.timer = fetchInDynamicInterval(
      showSpinner as boolean,
      fetchInProgress,
      setFetchInProgress,
      fetcher,
      interval,
      startTime,
      "/fsc/beantragen?index"
    );
    return () => {
      if (interval.timer) {
        clearInterval(interval.timer);
        interval.stoppedFetching = true;
      }
    };
  }, [fetcher, showSpinner]);

  return (
    <div className="lg:pr-[10%]">
      <ContentContainer size="sm-md" className="mb-80">
        <BreadcrumbNavigation />
        <Headline>
          Beantragen Sie einen Freischaltcode um die Erklärung später absenden
          zu können
        </Headline>

        <IntroText>
          Den Freischaltcode nutzen wir zur Identifikation der abgebenden
          Person. Zur Beantragung benötigen Sie die Steuer-Identifikationsnummer
          und Geburtsdatum.
        </IntroText>

        <IntroText>
          Der Freischaltcode wird von Ihrem technischen Finanzamt als Brief an
          Ihre Meldeadresse versendet. Dies dauert in der Regel 7 bis 14 Tage.
        </IntroText>

        <Hint>
          Wenn Sie bereits ein Konto bei{" "}
          <a
            href="https://www.elster.de/eportal/start"
            target="_blank"
            className="underline text-blue-800"
          >
            MeinELSTER
          </a>{" "}
          haben, können Sie sich nicht über einen Freischaltcode identifizieren.
          Nutzen Sie stattdessen die{" "}
          <a href="/ekona" className="underline text-blue-800">
            Identifikation über ELSTER
          </a>
          .
        </Hint>

        {showError && !isSubmitting && (
          <ErrorBar className="mb-32">
            <p className="mb-16">
              Es ist ein Fehler aufgetreten.
              <br />
              Bitte überprüfen Sie Ihre Angaben.
            </p>
            <p>
              <em>Mögliche Ursachen:</em>
            </p>
            <ul className="list-disc mb-16 pl-20">
              <li>
                Steuer-Identifikationsnummer und/oder Geburtsdatum sind nicht
                korrekt
              </li>
              <li>
                mit der gleichen Steuer-Identifikationsnummer wurde bereits ein
                Freischaltcode von einem anderen Konto aus beantragt
              </li>
              <li>
                nach 5 Falscheingaben kann ein erneuter Versuch erst wieder nach
                7 Tagen erfolgen
              </li>
            </ul>
            <p>
              Weitere Informationen finden Sie in unserem{" "}
              <a
                href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/7/54"
                rel="noopener"
                target="_blank"
                className="underline"
              >
                Hilfebereich
              </a>
              .
            </p>
          </ErrorBar>
        )}
        {actionData?.ericaApiError && (
          <ErrorBar className="mb-32">
            Bitte überprüfen Sie Ihre Angaben. <br />
            Insbesondere, dass Sie die Steuer-Identifikationsnummer und nicht
            die Steuernummer eingegeben haben.
          </ErrorBar>
        )}

        <Form method="post" action={"/fsc/beantragen?index"}>
          <CsrfToken value={loaderData.csrfToken} />
          <div>
            <FormGroup>
              <SteuerIdField
                name="steuerId"
                label="Steuer-Identifikationsnummer"
                placeholder="99 999 999 999"
                error={errors?.steuerId}
                help={
                  <>
                    <p className="mb-32">
                      Bei der Steuer-Identifikationsnummer handelt es sich nicht
                      um die Steuernummer Ihres Grundstücks. Sie finden die
                      Steuer-Identifikationsnummer zum Beispiel auf Ihrem
                      letzten Einkommensteuerbescheid oder suchen Sie in Ihren
                      Unterlagen nach einem Brief vom Bundeszentralamt für
                      Steuern. Die 11-stellige Nummer steht oben rechts groß auf
                      dem Brief.
                    </p>
                    <img
                      src={steuerIdImg}
                      alt="Abbildung des Briefes des Bundeszentralamtes mit der Steuer-Identifikationsnummer"
                    />
                  </>
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
            <Button look="secondary" to="/identifikation">
              Zurück zu Identifikationsoptionen
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
            startTime={startTime}
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
