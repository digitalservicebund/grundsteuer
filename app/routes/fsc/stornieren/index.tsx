import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  IntroText,
  Spinner,
} from "~/components";
import ErrorBar from "~/components/ErrorBar";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { useEffect, useState } from "react";
import { authenticator } from "~/auth.server";
import {
  findUserByEmail,
  saveEricaRequestIdFscStornieren,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { commitSession, getSession } from "~/session.server";
import { revokeFscForUser } from "~/erica/freischaltCodeStornieren";
import { ericaUtils } from "~/erica/utils";
import { fetchInDynamicInterval, IntervalInstance } from "~/routes/fsc/_utils";
import { flags } from "~/flags.server";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";

type LoaderData = {
  csrfToken?: string;
  showSpinner?: boolean;
  ericaDown?: boolean;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  const userData = await findUserByEmail(sessionUser.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  // cron job successfully canceled fsc request
  if (!userData.fscRequest) {
    return redirect("/fsc/stornieren/erfolgreich");
  }

  // fsc cancelling is in progress
  if (userData.ericaRequestIdFscStornieren) {
    return json({
      showSpinner: true,
    });
  }

  const csrfToken = createCsrfToken(session);
  return json(
    {
      csrfToken,
      ericaDown: flags.isEricaDown(),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

type ActionData = {
  startTime?: number;
  ericaApiError?: string;
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<ActionData | Response> => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "fsc", 120);
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  await verifyCsrfToken(request);
  const userData = await findUserByEmail(sessionUser.email);

  invariant(
    userData && userData.fscRequest && !userData.ericaRequestIdFscStornieren,
    "Expected an user eligible for fsc request revocation."
  );

  const ericaRequestIdOrError = await revokeFscForUser(userData);

  if ("error" in ericaRequestIdOrError) {
    console.warn(
      "Failed to revocate FSC on neu beantragen with error message: ",
      ericaRequestIdOrError.error
    );
    return json({ ericaApiError: ericaRequestIdOrError.error });
  }

  await saveEricaRequestIdFscStornieren(
    userData.email,
    ericaRequestIdOrError.location
  );

  await ericaUtils.setClientIpForEricaRequest(
    ericaRequestIdOrError.location,
    clientIp
  );

  return json({ startTime: Date.now() });
};

export default function FscStornieren() {
  const loaderData: LoaderData | undefined = useLoaderData();
  const actionData: ActionData | undefined = useActionData();

  const fetcher = useFetcher();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  const [showSpinner, setShowSpinner] = useState(loaderData?.showSpinner);
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
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (loaderData) {
      setShowSpinner(loaderData.showSpinner);
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
      "/fsc/stornieren?index"
    );
    return () => {
      if (interval.timer) {
        clearInterval(interval.timer);
        interval.stoppedFetching = true;
      }
    };
  }, [fetcher, showSpinner]);

  return (
    <div>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>Freischaltcode stornieren?</Headline>
        <IntroText>
          Um einen neuen Freischaltcode beantragen zu können, muss die aktuelle
          Beantragung storniert werden.
        </IntroText>

        {actionData?.ericaApiError && (
          <ErrorBar className="mb-32">
            Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
          </ErrorBar>
        )}

        <Form method="post" action="/fsc/stornieren?index">
          <CsrfToken value={loaderData?.csrfToken} />
          <ButtonContainer className="mb-80">
            <Button
              disabled={isSubmitting || showSpinner || loaderData.ericaDown}
            >
              Freischaltcode stornieren & weiter
            </Button>
            <Button look="secondary" to="/fsc/eingeben">
              Zurück
            </Button>
          </ButtonContainer>
        </Form>
        {showSpinner && (
          <Spinner
            initialText={"Ihr Freischaltcode wird storniert."}
            waitingText={
              "Das Stornieren dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
            }
            longerWaitingText={
              "Wir stornieren weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
            }
            startTime={startTime}
          />
        )}
      </ContentContainer>
    </div>
  );
}
