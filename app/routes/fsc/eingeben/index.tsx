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
  Spinner,
  UebersichtStep,
} from "~/components";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { removeUndefined } from "~/util/removeUndefined";
import {
  activateFreischaltCode,
  checkFreischaltcodeActivation,
} from "~/erica/freischaltCodeAktivieren";
import {
  deleteEricaRequestIdFscAktivieren,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  saveEricaRequestIdFscStornieren,
  setUserInFscEingebenProcess,
  User,
} from "~/domain/user";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";
import { useEffect, useState } from "react";
import FreischaltCodeInput from "~/components/FreischaltCodeInput";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";
import ErrorBar from "~/components/ErrorBar";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import FreischaltcodeHelp from "~/components/form/help/Freischaltcode";
import { getErrorMessageForFreischaltcode } from "~/domain/validation/fscValidation";
import { saveSuccessfulFscActivationData } from "~/domain/lifecycleEvents.server";
import { ericaUtils } from "~/erica/utils";
import { fetchInDynamicInterval, IntervalInstance } from "~/routes/fsc/_utils";
import { flags } from "~/flags.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";
import Hint from "~/components/Hint";
import letter from "~/assets/images/fsc-letter-eingeben.png";
import letterImg from "~/assets/images/letter-medium.svg";
import letterImgSmall from "~/assets/images/letter-small.svg";
import { canEnterFsc } from "~/domain/identificationStatus";
import FscHint from "~/components/fsc/FscHint";
import { FscRequest } from "~/domain/fscRequest";
import LinkWithArrow from "~/components/LinkWithArrow";
import EnumeratedList from "~/components/EnumeratedList";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { getBundesIdentUrl } from "~/routes/bundesIdent/_bundesIdentUrl";

type LoaderData = {
  csrfToken?: string;
  showError: boolean;
  showSpinner: boolean;
  remainingDays: number;
  antragDate: string;
  letterArrivalDate: string;
  ekonaDown?: boolean;
  ericaDown?: boolean;
  bundesIdentUrl: string;
};

const isEricaRequestInProgress = (userData: User) => {
  return isEricaActivationRequestInProgress(userData);
};

const isFscEingebenProcessStarted = (userData: User) => {
  return userData.inFscEingebenProcess;
};

const isEricaActivationRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscAktivieren);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return !isFscEingebenProcessStarted(userData) && userData.identified;
};

const getEricaRequestIdFscAktivieren = async (userData: User) => {
  invariant(
    userData.ericaRequestIdFscAktivieren,
    "ericaRequestIdFscAktivieren is null"
  );
  return userData.ericaRequestIdFscAktivieren;
};

const handleFscActivationProgress = async (
  userData: User,
  session: Session,
  clientIp: string,
  successLoggingMessage?: string
) => {
  const ericaRequestIdFscAktivieren = await getEricaRequestIdFscAktivieren(
    userData
  );
  const fscActivatedOrError = await checkFreischaltcodeActivation(
    ericaRequestIdFscAktivieren
  );
  if (fscActivatedOrError) {
    if ("transferticket" in fscActivatedOrError) {
      await saveSuccessfulFscActivationData(
        userData.email,
        ericaRequestIdFscAktivieren,
        clientIp,
        fscActivatedOrError.transferticket
      );
      session.set(
        "user",
        Object.assign(session.get("user"), { identified: true })
      );
      console.log(`${successLoggingMessage}`);

      await startNewFscRevocationProcess(userData, clientIp);
      await setUserInFscEingebenProcess(userData.email, false);
    } else if (fscActivatedOrError?.errorType == "EricaUserInputError") {
      await deleteEricaRequestIdFscAktivieren(userData.email);
      await setUserInFscEingebenProcess(userData.email, false);
      return {
        showError: true,
        showSpinner: false,
      };
    } else {
      await deleteEricaRequestIdFscAktivieren(userData.email);
      await setUserInFscEingebenProcess(userData.email, false);
      throw new Error(
        `${fscActivatedOrError?.errorType}: ${fscActivatedOrError?.errorMessage}`
      );
    }
  }
};

const startNewFscRevocationProcess = async (
  userData: User,
  clientIp: string
) => {
  let ericaRequestIdOrError;
  try {
    ericaRequestIdOrError = await revokeFscForUser(userData);
  } catch {
    console.warn("Failed to revoke fsc");
    return;
  }
  if (ericaRequestIdOrError && "location" in ericaRequestIdOrError) {
    await saveEricaRequestIdFscStornieren(
      userData.email,
      ericaRequestIdOrError.location
    );
    await ericaUtils.setClientIpForEricaRequest(
      ericaRequestIdOrError.location,
      clientIp
    );
  } else {
    console.warn(
      "Failed to revoke FSC on eingeben with error message: ",
      ericaRequestIdOrError.error
    );
  }
};

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData | Response> => {
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const dbUser: User | null = await findUserByEmail(user.email);
  if (!dbUser) return logoutDeletedUser(request);
  const session = await getSession(request.headers.get("Cookie"));

  if (!canEnterFsc(dbUser)) {
    return redirect("/identifikation");
  }

  invariant(dbUser.fscRequest, "expected an fscRequest in database for user");
  const antragStatus = new FscRequest(dbUser.fscRequest).getAntragStatus();

  if (antragStatus.remainingDays <= 0) {
    return redirect("/fsc/abgelaufen");
  }

  const fscEingebenProcessStarted = isFscEingebenProcessStarted(dbUser);
  const ericaActivationRequestIsInProgress =
    isEricaActivationRequestInProgress(dbUser);

  if (await wasEricaRequestSuccessful(dbUser)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  const bundesIdentUrl = getBundesIdentUrl(request);

  if (ericaActivationRequestIsInProgress) {
    const fscActivationData = await handleFscActivationProgress(
      dbUser,
      session,
      clientIp,
      `FSC activated for user with id ${dbUser?.id}`
    );
    if (fscActivationData) {
      return { ...fscActivationData, ...antragStatus, bundesIdentUrl };
    }
  }

  // The cronjob was faster with handling the activation request
  if (
    fscEingebenProcessStarted &&
    !ericaActivationRequestIsInProgress &&
    dbUser.identified
  ) {
    await startNewFscRevocationProcess(dbUser, clientIp);
    await setUserInFscEingebenProcess(dbUser.email, false);
  }

  const csrfToken = createCsrfToken(session);

  const updatedUserData = await findUserByEmail(user.email);
  invariant(updatedUserData, "Expected to find user again");

  if (await wasEricaRequestSuccessful(updatedUserData)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  return json(
    {
      csrfToken,
      showError: false,
      showSpinner: isEricaActivationRequestInProgress(updatedUserData),
      ericaDown: flags.isEricaDown(),
      ...antragStatus,
      bundesIdentUrl,
      testFeaturesEnabled: testFeaturesEnabled(),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

type EingebenActionData = {
  ericaApiError?: string;
  startTime?: number;
  errors?: Record<string, string>;
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<EingebenActionData | Response> => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "fsc", 120);
  await verifyCsrfToken(request);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  if (!userData) return logoutDeletedUser(request);
  const session = await getSession(request.headers.get("Cookie"));

  if (isEricaRequestInProgress(userData)) return {};

  invariant(userData.fscRequest, "expected an fscRequest in database for user");
  const elsterRequestId = userData.fscRequest.requestId;

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  const formData = await request.formData();
  const freischaltCode = formData.get("freischaltCode");

  invariant(
    typeof freischaltCode === "string",
    "expected formData to include freischaltCode field of type string"
  );

  const errors = {
    freischaltCode: await getErrorMessageForFreischaltcode(freischaltCode),
  };

  const errorsExist = errors.freischaltCode;

  if (errorsExist) {
    return {
      errors: removeUndefined(errors),
    };
  }

  const ericaRequestIdOrError = await activateFreischaltCode(
    freischaltCode,
    elsterRequestId
  );
  if ("location" in ericaRequestIdOrError) {
    await saveEricaRequestIdFscAktivieren(
      user.email,
      ericaRequestIdOrError.location
    );
    await ericaUtils.setClientIpForEricaRequest(
      ericaRequestIdOrError.location,
      clientIp
    );
    await setUserInFscEingebenProcess(userData.email, true);
  } else {
    return { ericaApiError: ericaRequestIdOrError.error };
  }

  return json(
    { startTime: Date.now() },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function FscEingeben() {
  const loaderData = useLoaderData<LoaderData>();
  const { antragDate, letterArrivalDate, remainingDays, bundesIdentUrl } =
    loaderData;
  const actionData: EingebenActionData | undefined = useActionData();
  const errors = actionData?.errors;

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

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
      showSpinner,
      fetchInProgress,
      setFetchInProgress,
      fetcher,
      interval,
      startTime,
      "/fsc/eingeben?index"
    );
    return () => {
      if (interval.timer) {
        clearInterval(interval.timer);
        interval.stoppedFetching = true;
      }
    };
  }, [fetcher, showSpinner]);

  if (remainingDays >= 90) {
    return (
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <UebersichtStep imageSrc={letterImg} smallImageSrc={letterImgSmall}>
          <ContentContainer size="sm">
            <Headline>Ihr Freischaltcode wurde beantragt</Headline>
            <Hint type="status">
              Ihr Freischaltcode wurde am {antragDate}. beantragt. Ihr Brief
              kommt voraussichtlich bis zum {letterArrivalDate} an.
            </Hint>
            <IntroText>
              Sie erhalten Ihren Freischaltcode voraussichtlich in den nächsten
              3 Wochen per Post. Sie können jetzt die Grundsteuererklärung
              ausfüllen und zu einem späteren Zeitpunkt den Freischaltcode
              eingeben.
            </IntroText>
            <Button to="/formular" className="min-w-[18rem]">
              Weiter zum Formular
            </Button>
          </ContentContainer>

          <div className="fsc-alternatives">
            <h2 className="mt-80 mb-16 text-24">
              Alternative zum Freischaltcode
            </h2>
            <EnumeratedList
              gap="48"
              items={[
                <div>
                  <p className="mb-8">
                    <strong>Ausweis und Smartphone:</strong> Sie haben außerdem
                    die Möglichkeit sich mit Ihrem Ausweis auf dem Smartphone zu
                    identifizieren.
                  </p>
                  <LinkWithArrow href={bundesIdentUrl}>
                    Zur Identifikation mit Personalausweis
                  </LinkWithArrow>
                </div>,
                <div>
                  <p className="mb-8">
                    <strong>ELSTER-Zertifikat:</strong> Vielleicht haben Sie
                    doch ein ELSTER-Zertifikat? Personen mit einem ELSTER Konto
                    erhalten in der Regel keinen Brief mit einem Freischaltcode.
                    Nutzen Sie Ihre ELSTER Zugangsdaten, um sich zu
                    identifizieren.
                  </p>
                  <LinkWithArrow href="/ekona">
                    Zur Identifikation mit ELSTER Zugang
                  </LinkWithArrow>
                </div>,
              ]}
            />
          </div>
        </UebersichtStep>
      </ContentContainer>
    );
  } else {
    return (
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>
          Super, Sie haben den Brief mit Ihrem Freischaltcode erhalten
        </Headline>
        <FscHint antragDate={antragDate} remainingDays={remainingDays} />

        <IntroText>
          Sie können nun Ihren Freischaltcode eingeben. Er steht auf der letzten
          Seite über der Zeile “Antragsteller/in: DigitalService GmbH des
          Bundes”.
        </IntroText>
        <img
          src={letter}
          alt="Bildbeispiel des Freischaltcode Brief"
          className="mb-32 ml-[-16px]"
        />

        {showError && !isSubmitting && (
          <ErrorBar className="mb-32">
            Der eingegebene Freischaltcode ist nicht gültig. Sie haben insgesamt
            5 Versuche. Danach müssen Sie einen neuen Freischaltcode beantragen.
          </ErrorBar>
        )}
        {actionData?.ericaApiError && (
          <ErrorBar className="mb-32">
            Der eingegebene Freischaltcode hat kein gültiges Format. Prüfen Sie
            Ihre Eingabe.
          </ErrorBar>
        )}

        <Form method="post" action={"/fsc/eingeben?index"}>
          <CsrfToken value={loaderData.csrfToken} />
          <div>
            <FormGroup>
              <FreischaltCodeInput
                name="freischaltCode"
                label="Freischaltcode"
                placeholder="XXXX-XXXX-XXXX"
                error={errors?.freischaltCode}
                help={<FreischaltcodeHelp />}
              />
            </FormGroup>
          </div>
          <ButtonContainer className="flex-col">
            <Button
              disabled={isSubmitting || showSpinner || loaderData.ericaDown}
            >
              Freischaltcode speichern
            </Button>
            <Button look="secondary" to="/formular/zusammenfassung">
              Zurück zur Übersicht
            </Button>
          </ButtonContainer>
        </Form>
        <h2 className="mt-80 mb-16 text-24">
          Sie haben keinen Freischaltcode erhalten?
        </h2>

        <p className="mb-16">
          Mehr als drei Wochen sind um und Sie haben noch keinen Brief mit dem
          Freischaltcode erhalten?
        </p>
        <LinkWithArrow href="/fsc/hilfe">
          Hilfe zum Freischaltcode
        </LinkWithArrow>

        {showSpinner && (
          <Spinner
            initialText={"Ihr Freischaltcode wird überprüft."}
            waitingText={
              "Das Überprüfen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
            }
            longerWaitingText={
              "Wir überprüfen weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
            }
            startTime={startTime}
          />
        )}
      </ContentContainer>
    );
  }
}
