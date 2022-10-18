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

const isEricaRequestInProgress = (userData: User) => {
  return (
    isEricaActivationRequestInProgress(userData) ||
    isEricaRevocationRequestInProgress(userData)
  );
};

const isEricaActivationRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscAktivieren);
};

export const isEricaRevocationRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscStornieren);
};

const wasEricaRequestSuccessful = async (userData: User, session: Session) => {
  return (
    !session.get("startedFscEingeben") &&
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
    } else if (fscActivatedOrError?.errorType == "EricaUserInputError") {
      await deleteEricaRequestIdFscAktivieren(userData.email);
      return {
        showError: true,
        showSpinner: false,
      };
    } else {
      await deleteEricaRequestIdFscAktivieren(userData.email);
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
      "Failed to revocate FSC on eingeben with error message: ",
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
  const fscRevocatedOrError = await checkFreischaltcodeRevocation(
    ericaRequestIdFscStornieren
  );
  if (fscRevocatedOrError) {
    if ("transferticket" in fscRevocatedOrError) {
      invariant(userData.fscRequest, "expected fscRequest to be present");
      await saveSuccessfulFscRevocationData(
        userData.email,
        ericaRequestIdFscStornieren,
        clientIp,
        fscRevocatedOrError.transferticket
      );
      console.log(`${successLoggingMessage}`);
      return { finished: true };
    } else if (fscRevocatedOrError?.errorType == "EricaUserInputError") {
      await deleteEricaRequestIdFscStornieren(userData.email);
      return {
        finished: true,
        showError: true,
        showSpinner: false,
      };
    } else if (fscRevocatedOrError?.errorType == "EricaRequestNotFound") {
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

export const loader: LoaderFunction = async ({ request, context }) => {
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

  const ericaActivationRequestIsInProgress =
    isEricaActivationRequestInProgress(userData);
  let ericaRevocationRequestIsInProgress =
    isEricaRevocationRequestInProgress(userData);

  if (await wasEricaRequestSuccessful(userData, session)) {
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
      return fscActivationData;
    }
  }

  if (ericaRevocationRequestIsInProgress) {
    // We only try to revocate. If it does not succeed, we do not want to show an error to the user
    const fscRevocationData = await handleFscRevocationInProgress(
      userData,
      clientIp,
      `FSC revoked after activation for user with id ${userData.id}`
    );
    if (fscRevocationData?.finished && fscRevocationData?.failure) {
      return fscRevocationData;
    }
  }
  if (
    session.get("startedFscEingeben") &&
    !ericaActivationRequestIsInProgress &&
    !ericaRevocationRequestIsInProgress
  ) {
    await startNewFscRevocationProcess(userData, clientIp);
    session.unset("startedFscEingeben");
    ericaRevocationRequestIsInProgress = true;
  }

  const csrfToken = createCsrfToken(session);

  return json(
    {
      csrfToken,
      showError: false,
      showSpinner:
        ericaActivationRequestIsInProgress ||
        ericaRevocationRequestIsInProgress,
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

  if (await wasEricaRequestSuccessful(userData, session)) {
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
    session.set("startedFscEingeben", true);
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
  const loaderData = useLoaderData();
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

  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <Headline>Bitte geben Sie Ihren Freischaltcode ein</Headline>
      <IntroText>
        Wir haben einen Freischaltcode für Sie beantragt. Dieser wird per Post
        innerhalb von 7 - 14 Tagen an Ihre Adresse versendet. Nach Erhalt des
        Briefes, finden Sie den Freischaltcode auf der letzten Seite. Er besteht
        aus 12 Zeichen.
      </IntroText>

      {showError && !isSubmitting && (
        <ErrorBar className="mb-32">
          Der eingegebene Freischaltcode ist nicht gültig. Sie haben insgesamt 5
          Versuche. Danach müssen Sie einen neuen Freischaltcode beantragen.
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
        <ButtonContainer>
          <Button disabled={isSubmitting || showSpinner}>
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
      <p className="mb-8">
        Zwei Wochen sind um und Sie haben noch keinen Brief mit dem
        Freischaltcode erhalten?
      </p>
      <div className="flex items-center mb-32">
        <ArrowRight className="inline-block mr-16" />
        <a
          href="/fsc/neuBeantragen?index"
          className="font-bold underline text-18 text-blue-800"
        >
          Freischaltcode neu beantragen
        </a>
      </div>
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
}
