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
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { removeUndefined } from "~/util/removeUndefined";
import {
  activateFreischaltCode,
  checkFreischaltcodeActivation,
} from "~/erica/freischaltCodeAktivieren";
import {
  deleteEricaRequestIdFscAktivieren,
  deleteEricaRequestIdFscStornieren,
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
import {
  checkFreischaltcodeRevocation,
  revokeFscForUser,
} from "~/erica/freischaltCodeStornieren";
import ErrorBar from "~/components/ErrorBar";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import FreischaltcodeHelp from "~/components/form/help/Freischaltcode";
import ArrowRight from "~/components/icons/mui/ArrowRight";
import { getErrorMessageForFreischaltcode } from "~/domain/validation/fscValidation";
import {
  saveSuccessfulFscActivationData,
  saveSuccessfulFscRevocationData,
} from "~/domain/lifecycleEvents.server";
import { ericaUtils } from "~/erica/utils";
import { fetchInDynamicInterval, IntervalInstance } from "~/routes/fsc/_utils";
import { flags } from "~/flags.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";
import Hint from "~/components/Hint";
import letter from "~/assets/images/fsc-letter-eingeben.png";
import letterImg from "~/assets/images/letter-medium.svg";
import letterImgSmall from "~/assets/images/letter-small.svg";
import { FscRequest } from "~/domain/fscRequest";
import { hasValidFscRequest } from "~/domain/identificationStatus";

type LoaderData = {
  csrfToken?: string;
  showError: boolean;
  showSpinner: boolean;
  remainingDays: number;
  antragDate: string;
  letterArrivalDate: string;
  ekonaDown?: boolean;
  ericaDown?: boolean;
};

const isEricaRequestInProgress = (userData: User) => {
  return (
    isEricaActivationRequestInProgress(userData) ||
    isEricaRevocationRequestInProgress(userData)
  );
};

const isFscEingebenProcessStarted = (userData: User) => {
  return userData.inFscEingebenProcess;
};

const isEricaActivationRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscAktivieren);
};

export const isEricaRevocationRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscStornieren);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return (
    !isFscEingebenProcessStarted(userData) &&
    userData.identified &&
    !isEricaRevocationRequestInProgress(userData)
  );
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

const getEricaRequestIdFscStornieren = async (userData: User) => {
  invariant(
    userData.ericaRequestIdFscStornieren,
    "ericaRequestIdFscStornieren is null"
  );
  return userData.ericaRequestIdFscStornieren;
};

export const handleFscRevocationInProgress = async (
  userData: User,
  clientIp: string,
  successLoggingMessage?: string
) => {
  const ericaRequestIdFscStornieren = await getEricaRequestIdFscStornieren(
    userData
  );
  const fscRevokedOrError = await checkFreischaltcodeRevocation(
    ericaRequestIdFscStornieren
  );
  if (fscRevokedOrError) {
    if ("transferticket" in fscRevokedOrError) {
      invariant(userData.fscRequest, "expected fscRequest to be present");
      await saveSuccessfulFscRevocationData(
        userData.email,
        ericaRequestIdFscStornieren,
        clientIp,
        fscRevokedOrError.transferticket
      );
      console.log(`${successLoggingMessage}`);
      return { finished: true };
    } else if (fscRevokedOrError?.errorType == "EricaUserInputError") {
      await deleteEricaRequestIdFscStornieren(userData.email);
      return {
        finished: true,
        showError: true,
        showSpinner: false,
      };
    } else if (fscRevokedOrError?.errorType == "EricaRequestNotFound") {
      await deleteEricaRequestIdFscStornieren(userData.email);
      return {
        finished: true,
        showError: false,
        showSpinner: false,
        failure: true,
      };
    } else {
      await deleteEricaRequestIdFscStornieren(userData.email);
      return { finished: true };
    }
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
  const userData: User | null = await findUserByEmail(user.email);
  const session = await getSession(request.headers.get("Cookie"));
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (!hasValidFscRequest(userData)) {
    return redirect("/identifikation");
  }

  invariant(userData.fscRequest, "Expected user to have a FscRequest");
  const fscRequest = new FscRequest(userData.fscRequest);
  const antragDate = fscRequest.creationDate();
  const letterArrivalDate = fscRequest.estLatestArrivalDate();
  const remainingDays = fscRequest.remainingValidityInDays();

  const antragStatus = { antragDate, letterArrivalDate, remainingDays };

  const fscEingebenProcessStarted = isFscEingebenProcessStarted(userData);
  const ericaActivationRequestIsInProgress =
    isEricaActivationRequestInProgress(userData);
  const ericaRevocationRequestIsInProgress =
    isEricaRevocationRequestInProgress(userData);

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  if (ericaActivationRequestIsInProgress) {
    const fscActivationData = await handleFscActivationProgress(
      userData,
      session,
      clientIp,
      `FSC activated for user with id ${userData?.id}`
    );
    if (fscActivationData) {
      return { ...fscActivationData, ...antragStatus };
    }
  }

  if (ericaRevocationRequestIsInProgress) {
    // We only try to revoke. If it does not succeed, we do not want to show an error to the user
    const fscRevocationData = await handleFscRevocationInProgress(
      userData,
      clientIp,
      `FSC revoked after activation for user with id ${userData.id}`
    );
    if (fscRevocationData?.finished && fscRevocationData?.failure) {
      return { ...fscRevocationData, ...antragStatus };
    }
  }

  // The cronjob was faster with handling the activation request
  if (
    fscEingebenProcessStarted &&
    !ericaActivationRequestIsInProgress &&
    !ericaRevocationRequestIsInProgress &&
    userData.identified
  ) {
    await startNewFscRevocationProcess(userData, clientIp);
    await setUserInFscEingebenProcess(userData.email, false);
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
      showSpinner:
        isEricaActivationRequestInProgress(updatedUserData) ||
        isEricaRevocationRequestInProgress(updatedUserData),
      ericaDown: flags.isEricaDown(),
      ...antragStatus,
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
  const session = await getSession(request.headers.get("Cookie"));

  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

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
  const { antragDate, letterArrivalDate, remainingDays } = loaderData;
  const actionData: EingebenActionData | undefined = useActionData();
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
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <UebersichtStep imageSrc={letterImg} smallImageSrc={letterImgSmall}>
          <Headline>Ihr Freischaltcode wurde beantragt</Headline>
          <Hint type="status">
            Ihr Freischaltcode wurde am {antragDate}. beantragt. Ihr Brief kommt
            voraussichtlich bis zum {letterArrivalDate} an.
          </Hint>
          <IntroText>
            Sie erhalten Ihren Freischaltcode voraussichtlich in den nächsten 3
            Wochen per Post. Sie können jetzt die Grundsteuererklärung ausfüllen
            und zu einem späteren Zeitpunkt den Freischaltcode eingeben.
          </IntroText>
          <Button to="/formular">Weiter zum Formular</Button>;
        </UebersichtStep>
      </ContentContainer>
    );
  } else if (remainingDays > 0) {
    return (
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>Haben Sie Ihren Freischaltcode schon erhalten?</Headline>
        <Hint type="status">
          Ihr Freischaltcode wurde am {antragDate} beantragt. Ihr Code läuft in{" "}
          {remainingDays} {remainingDays === 1 ? "Tag" : "Tagen"} ab.
        </Hint>

        <IntroText>
          Ihren Freischaltcode finden Sie in dem Brief, den Sie von Ihrem
          Finanzamt erhalten haben. Der Code steht auf der letzten Seite.
        </IntroText>
        <img
          src={letter}
          alt="Bildbeispiel des Freischaltcode Brief"
          className="mb-32"
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
        <h2 className="mt-80 mb-16 text-24 font-bold">
          Keinen Freischaltcode erhalten?
        </h2>
        {remainingDays < 90 && (
          <>
            <p className="mb-8">
              3 Wochen sind um und Sie haben noch keinen Brief mit dem
              Freischaltcode erhalten?
            </p>
            <div className="flex items-center mb-32">
              <ArrowRight className="inline-block mr-16" />
              <a
                href="/fsc/stornieren"
                className="font-bold underline text-18 text-blue-800"
              >
                Freischaltcode neu beantragen
              </a>
            </div>
          </>
        )}
        <p className="mb-8">
          Personen mit einem ELSTER Konto erhalten in der Regel keinen Brief mit
          einem Freischaltcode. Sie können Ihre ELSTER Zugangsdaten nutzen, um
          sich zu identifizieren.
        </p>
        <div className="flex items-center">
          <ArrowRight className="inline-block mr-16" />
          <a
            href={"/ekona?index"}
            className="font-bold underline text-18 text-blue-800"
          >
            Mit ELSTER Zugang identifizieren
          </a>
        </div>

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
  } else {
    return (
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>Ihr Freischaltcode ist leider abgelaufen.</Headline>

        <Hint type="status">
          Ihr Code hat nach 90 Tagen seine Gültigkeit verloren. Beantragen Sie
          bitte einen neuen Freischaltcode.
        </Hint>

        <ButtonContainer className="flex-col">
          <Button to="/fsc/stornieren">Freischaltcode neu beantragen</Button>
          <Button look="secondary" to="/formular/zusammenfassung">
            Zurück zur Übersicht
          </Button>
        </ButtonContainer>
      </ContentContainer>
    );
  }
}
