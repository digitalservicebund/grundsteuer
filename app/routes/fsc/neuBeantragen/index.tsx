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
import { getRedirectionParams } from "~/routes/fsc/index";
import steuerIdImg from "~/assets/images/help/help-steuer-id.png";
import lohnsteuerbescheinigungImage from "~/assets/images/lohnsteuerbescheinigung_idnr.svg";
import fscLetterImage from "~/assets/images/fsc-letter.svg";
import fscInputImage from "~/assets/images/fsc-input.svg";

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
      clientIp,
      `FSC revoked for user with id ${userData?.id}`
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

  if (userData.fscRequest) {
    await revokeFsc(userData);
  } else {
    await requestNewFsc(
      normalizedSteuerId,
      normalizedGeburtsdatum,
      userData.email
    );
  }
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
            Bitte überprüfen Sie Ihre Angaben. <br />
            Die Steuer-Identifikationsnummer und Geburtsdatum müssen zur selben
            Person gehören. <br />
            Nach 5 falschen Eingaben der Daten können Sie erst wieder in 7 Tagen
            einen Freischaltcode beantragen.
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
            <Button look="secondary" to="/formular/welcome">
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
