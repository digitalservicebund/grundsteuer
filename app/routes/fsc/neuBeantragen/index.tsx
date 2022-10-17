import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  Session,
} from "@remix-run/node";
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
import Hint from "~/components/Hint";
import ErrorBar from "~/components/ErrorBar";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import SteuerIdField from "~/components/form/SteuerIdField";
import { useEffect, useState } from "react";
import EnumeratedCard from "~/components/EnumeratedCard";
import { authenticator } from "~/auth.server";
import {
  findUserByEmail,
  saveEricaRequestIdFscStornieren,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import {
  getBeantragenData,
  handleFscRequestInProgress,
  requestNewFsc,
  validateBeantragenData,
} from "~/routes/fsc/beantragen";
import { handleFscRevocationInProgress } from "~/routes/fsc/eingeben";
import { commitSession, getSession } from "~/session.server";
import steuerIdImg from "~/assets/images/help/help-steuer-id.png";
import lohnsteuerbescheinigungImage from "~/assets/images/lohnsteuerbescheinigung_idnr.svg";
import fscLetterImage from "~/assets/images/fsc-letter.svg";
import fscInputImage from "~/assets/images/fsc-input.svg";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";
import { ericaUtils } from "~/erica/utils";
import { fetchInDynamicInterval, IntervalInstance } from "~/routes/fsc/_utils";

const isEricaRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscBeantragen);
};

const isEricaRevocationInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscStornieren);
};

const wasProcessSuccessful = async (userData: User, session: Session) => {
  return (
    !(await session.get("startedNeuBeantragen")) &&
    Boolean(await session.get("fscData")) &&
    Boolean(userData.fscRequest) &&
    !isEricaRequestInProgress(userData) &&
    !isEricaRevocationInProgress(userData)
  );
};

const startNewFscRequestProcess = async (
  userEmail: string,
  session: Session,
  clientIp: string
) => {
  const fscData = await session.get("fscData");
  const ericaApiError = await requestNewFsc(
    fscData.steuerId,
    fscData.geburtsdatum,
    userEmail,
    clientIp
  );
  session.unset("startedNeuBeantragen");
  if (ericaApiError) return { ericaApiError };
};

type NeuBeantragenLoaderData = {
  csrfToken?: string;
  showError?: boolean;
  showSpinner?: boolean;
  ericaApiError?: string;
};

export const loader: LoaderFunction = async ({
  context,
  request,
}): Promise<NeuBeantragenLoaderData | Response> => {
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );
  const ericaFscRevocationIsInProgress = isEricaRevocationInProgress(userData);
  let ericaFscRequestIsInProgress = isEricaRequestInProgress(userData);

  if (ericaFscRevocationIsInProgress) {
    const fscRevocationResult = await handleFscRevocationInProgress(
      userData,
      clientIp,
      `FSC revoked for user with id ${userData?.id}`
    );
    if (fscRevocationResult?.finished) {
      if (fscRevocationResult.failure) {
        throw new Error(`FSC Revocation request not found`);
      }
      const result = await startNewFscRequestProcess(
        userData.email,
        session,
        clientIp
      );
      if (result) return result;
    }
  }

  if (ericaFscRequestIsInProgress) {
    const fscRequestError = await handleFscRequestInProgress(
      userData,
      clientIp,
      `FSC newly requested for user with id ${userData?.id}`
    );
    if (fscRequestError) {
      session.unset("fscData");
      return json(fscRequestError, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  if (
    session.get("startedNeuBeantragen") &&
    !ericaFscRevocationIsInProgress &&
    !ericaFscRequestIsInProgress
  ) {
    const result = await startNewFscRequestProcess(
      userData.email,
      session,
      clientIp
    );
    ericaFscRequestIsInProgress = true;
    if (result) return result;
  }

  if (await wasProcessSuccessful(userData, session)) {
    session.unset("fscData");
    return redirect("/fsc/neuBeantragen/erfolgreich", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const csrfToken = createCsrfToken(session);
  return json(
    {
      csrfToken,
      showError: false,
      showSpinner:
        ericaFscRevocationIsInProgress || ericaFscRequestIsInProgress,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

type NeuBeantragenActionData = {
  errors?: Record<string, string>;
  startTime?: number;
  ericaApiError?: string;
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<NeuBeantragenActionData | Response> => {
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  await verifyCsrfToken(request);
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (
    isEricaRequestInProgress(userData) ||
    isEricaRevocationInProgress(userData)
  )
    return {};

  const formData = await getBeantragenData(request);
  const normalizedSteuerId = formData.steuerId.replace(/[\s/]/g, "");
  const normalizedGeburtsdatum = formData.geburtsdatum.replace(/\s/g, "");
  const validationErrors = await validateBeantragenData({
    steuerId: normalizedSteuerId,
    geburtsdatum: normalizedGeburtsdatum,
  });
  if (validationErrors) return validationErrors;
  const session = await getSession(request.headers.get("Cookie"));

  if (userData.fscRequest) {
    const ericaRequestIdOrError = await revokeFscForUser(userData);
    if ("error" in ericaRequestIdOrError) {
      console.warn(
        "Failed to revocate FSC on neu beantragen with error message: ",
        ericaRequestIdOrError.error
      );
      return { ericaApiError: ericaRequestIdOrError.error };
    }
    await saveEricaRequestIdFscStornieren(
      userData.email,
      ericaRequestIdOrError.location
    );
    await ericaUtils.setClientIpForEricaRequest(
      ericaRequestIdOrError.location,
      clientIp
    );
    session.set("startedNeuBeantragen", true);
  } else {
    const ericaApiError = await requestNewFsc(
      normalizedSteuerId,
      normalizedGeburtsdatum,
      userData.email,
      clientIp
    );
    if (ericaApiError) return { ericaApiError };
    session.unset("startedNeuBeantragen");
  }
  session.set("fscData", {
    steuerId: normalizedSteuerId,
    geburtsdatum: normalizedGeburtsdatum,
  });

  return json(
    { startTime: Date.now() },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function FscNeuBeantragen() {
  const loaderData: NeuBeantragenLoaderData | undefined = useLoaderData();
  const actionData: NeuBeantragenActionData | undefined = useActionData();
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
      "/fsc/neuBeantragen?index"
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
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>Freischaltcode neu beantragen</Headline>
        <IntroText>
          Falls der Brief nach zwei Wochen bei Ihnen nicht angekommen ist,
          empfehlen wir Ihnen, den Freischaltcode neu zu beantragen.
        </IntroText>
        <IntroText>
          Der zuvor beantragte Freischaltcode wird automatisch storniert und
          kann nicht mehr eingegeben werden.
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
            Bitte überprüfen Sie Ihre Angaben. <br />
            Die Steuer-Identifikationsnummer und Geburtsdatum müssen zur selben
            Person gehören. <br />
            Nach 5 falschen Eingaben der Daten können Sie erst wieder in 7 Tagen
            einen Freischaltcode beantragen.
          </ErrorBar>
        )}
        {(loaderData?.ericaApiError || actionData?.ericaApiError) && (
          <ErrorBar className="mb-32">
            Bitte überprüfen Sie Ihre Angaben. <br />
            Insbesondere, dass Sie die Steuer-Identifikationsnummer und nicht
            die Steuernummer eingegeben haben.
          </ErrorBar>
        )}

        <Form method="post" action={"/fsc/neuBeantragen?index"}>
          <CsrfToken value={loaderData?.csrfToken} />
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
          <ButtonContainer className="mb-80">
            <Button disabled={isSubmitting || showSpinner}>
              Freischaltcode neu beantragen
            </Button>
            <Button look="secondary" to="/formular">
              Zurück zum Formular
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
      <div className="md:mb-144">
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
    </div>
  );
}
