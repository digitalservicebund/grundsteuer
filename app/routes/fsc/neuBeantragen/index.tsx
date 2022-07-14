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
import freischaltcodeImg from "~/assets/images/help/freischaltcode-no-explanation.png";
import { authenticator } from "~/auth.server";
import { findUserByEmail, User } from "~/domain/user";
import invariant from "tiny-invariant";
import {
  getBeantragenData,
  handleFscRequestInProgress,
  requestNewFsc,
  validateBeantragenData,
} from "~/routes/fsc/beantragen";
import {
  handleFscRevocationInProgress,
  revokeFsc,
} from "~/routes/fsc/eingeben";
import { commitSession, getSession } from "~/session.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { getRedirectionParams } from "~/routes/fsc/index";

const isEricaRequestInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscBeantragen);
};

const isEricaRevocationInProgress = (userData: User) => {
  return Boolean(userData.ericaRequestIdFscStornieren);
};

const wasProcessSuccessful = async (userData: User, session: Session) => {
  return (
    Boolean(await session.get("fscData")) &&
    Boolean(userData.fscRequest) &&
    !isEricaRequestInProgress(userData) &&
    !isEricaRevocationInProgress(userData)
  );
};

export const loader: LoaderFunction = async ({ context, request }) => {
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
  const ericaFscRequestIsInProgress = isEricaRequestInProgress(userData);

  if (ericaFscRevocationIsInProgress) {
    const fscRevocationResult = await handleFscRevocationInProgress(
      userData,
      clientIp
    );
    if (fscRevocationResult?.finished) {
      const fscData = await session.get("fscData");
      await requestNewFsc(
        fscData.steuerId,
        fscData.geburtsdatum,
        userData.email
      );
    }
  }

  if (ericaFscRequestIsInProgress) {
    const fscRequestError = await handleFscRequestInProgress(
      userData,
      clientIp
    );
    if (fscRequestError) {
      //TESTEN: Fehler im Request + neu Abschicken geänderter Daten -> 400?!
      Object.assign(fscRequestError, { csrfToken: createCsrfToken(session) });
      session.unset("fscData");
      return json(fscRequestError, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  if (await wasProcessSuccessful(userData, session)) {
    session.unset("fscData");
    return redirect(
      "/fsc/neuBeantragen/erfolgreich" + getRedirectionParams(request.url),
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  const csrfToken = createCsrfToken(session);
  return json(
    {
      csrfToken,
      showError: false,
      showSpinner:
        ericaFscRevocationIsInProgress || ericaFscRequestIsInProgress,
      showTestFeatures: testFeaturesEnabled,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
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

  await revokeFsc(userData);
  const session = await getSession(request.headers.get("Cookie"));
  session.set("fscData", {
    steuerId: normalizedSteuerId,
    geburtsdatum: normalizedGeburtsdatum,
  });

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function FscNeuBeantragen() {
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
        fetcher.load("/fsc/neuBeantragen?index" + redirectionParams);
      }
    }, 1000);
    return () => clearInterval(interval);
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
          Sie erhalten keinen Brief, wenn Sie bereits ein Konto bei Mein ELSTER
          und dort einen Abrufcode beantragt haben. In diesem Fall können Sie
          die Identifikation mit einem Freischaltcode leider nicht verwenden.
          Wir planen aber, ab September die Identifikation mit einem ELSTER
          Zertifikat anzubieten.
        </Hint>

        {showError && !isSubmitting && (
          <ErrorBar className="mb-32">
            Mit diesen Daten können wir keinen Freischaltcode beantragen.
          </ErrorBar>
        )}

        <Form
          method="post"
          action={"/fsc/neuBeantragen?index" + redirectionParams}
        >
          <CsrfToken value={loaderData.csrfToken} />
          <div>
            <FormGroup>
              <SteuerIdField
                name="steuerId"
                label="Steuer-Identifikationsnummer"
                placeholder="11 111 111 111"
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
          <ButtonContainer className="mb-80">
            <Button disabled={isSubmitting || showSpinner}>
              Freischaltcode neu beantragen
            </Button>
            <Button look="secondary" to="/formular/welcome">
              Zurück
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
      <div className="md:mb-144">
        <h2 className="text-24 mb-24">
          Wo finde ich den Freischaltcode auf dem Brief vom Finanzamt?
        </h2>
        <EnumeratedCard
          image={freischaltcodeImg}
          imageAltText="Beispiel Freischaltcode Brief"
          heading="Brief vom Finanzamt"
          text="Ihnen wurde ein Brief per Post zugestellt. In diesem finden Sie den 12-stelligen Freischaltcode."
          className="mb-16"
        />
      </div>
    </div>
  );
}
