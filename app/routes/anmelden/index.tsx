import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  Input,
  IntroText,
  LoggedOutLayout,
  SubHeadline,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { userExists } from "~/domain/user";
import { sendLoginAttemptEmail } from "~/email.server";
import ErrorBar from "~/components/ErrorBar";
import EmailOutlined from "~/components/icons/mui/EmailOutlined";
import Hint from "~/components/Hint";
import { useTranslation } from "react-i18next";
import { validateEmail, validateRequired } from "~/domain/validation";
import { removeUndefined } from "~/util/removeUndefined";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

const validateInputEmail = (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat");

export const meta: MetaFunction = () => {
  return { title: pageTitle("Anmelden") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/formular/welcome",
  });

  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = createCsrfToken(session);

  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  return json(
    {
      csrfToken,
      error,
      showNewFeatures: testFeaturesEnabled(),
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  await verifyCsrfToken(request);

  // clone request before accessing formData, as remix-auth also needs the formData
  // and it can only be accessed once
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const email = formData.get("email");

  invariant(
    typeof email === "string",
    "expected formData to include email field of type string"
  );

  const normalizedEmail = email.trim().toLowerCase();

  const errors = {
    email: validateInputEmail(normalizedEmail),
  };
  const errorsExist = Object.keys(removeUndefined(errors)).length > 0;
  if (errorsExist) {
    return {
      errors: removeUndefined(errors),
    };
  }

  if (await userExists(normalizedEmail)) {
    return authenticator.authenticate(
      process.env.SKIP_AUTH === "true" ? "form" : "email-link",
      request,
      {
        successRedirect: "/anmelden/email",
      }
    );
  } else {
    await sendLoginAttemptEmail({ emailAddress: normalizedEmail });
    console.log("unknown email!");
    return redirect("/anmelden/email");
  }
};

export default function Anmelden() {
  const { t } = useTranslation("all");
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <LoggedOutLayout showNewFeatures={loaderData.showNewFeatures}>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        {loaderData?.error === "token" && (
          <ErrorBar className="mb-64">
            Der Login Link hat leider nicht funktioniert. Bitte beachten Sie,
            dass Sie immer nur den zuletzt angeforderten Login Link verwenden
            können und die Gültigkeit des Links auf 24 Stunden begrenzt ist.
            Stellen Sie außerdem sicher, dass Sie den Login Link im gleichen
            Browser auf dem gleichen Gerät aufrufen, in dem Sie auch die
            Anmeldung oder Registrierung angefangen haben. Bitte führen Sie die
            Anmeldung oder Registrierung erneut durch um einen neuen Login Link
            zu erhalten.
          </ErrorBar>
        )}

        {!loaderData?.showNewFeatures && (
          <>
            <Headline>Herzlich willkommen</Headline>
            <div className="mb-80">
              <SubHeadline>Ich bin das erste Mal hier</SubHeadline>
              <IntroText>
                Erstellen Sie ein Konto um die Bearbeitung nach Wunsch
                unterbrechen- und später fortsetzen zu können.
              </IntroText>
              <Button to="/registrieren">Konto erstellen</Button>
            </div>

            <SubHeadline>Ich habe bereits ein Konto</SubHeadline>
            <IntroText>
              Bitte geben Sie die E-Mail-Adresse ein, mit der Sie sich
              registriert haben. Wir senden Ihnen einen Link für die Anmeldung.
              Es wird kein Passwort benötigt.
            </IntroText>
          </>
        )}
        {loaderData?.showNewFeatures && (
          <>
            <Headline>Melden Sie sich in Ihrem Nutzerkonto an</Headline>
          </>
        )}
        <Hint className="mb-40">
          Die Weiterbearbeitung ist nur mit dem Gerät und dem Browser möglich,
          mit dem das Konto erstellt wurde. Der Grund: Ihre Formulardaten werden
          nur im Cookie in Ihrem Browser gespeichert.
        </Hint>
        {errors && !isSubmitting && <ErrorBarStandard />}
        <div className="mb-80">
          <Form method="post" noValidate>
            <CsrfToken value={loaderData.csrfToken} />
            <div className="mb-32">
              <Input
                type="email"
                name="email"
                label="E-Mail-Adresse"
                error={t(errors?.email)}
                className="mb-80"
              />
            </div>
            <Button
              data-testid="submit"
              icon={<EmailOutlined />}
              disabled={isSubmitting}
              className="mb-32"
            >
              Login Link senden
            </Button>
            {loaderData?.showNewFeatures && (
              <>
                <p>Sie sind das erste Mal hier?</p>
                <p>
                  Hier können Sie die{" "}
                  <a href="/pruefen/start" className="underline text-blue-800">
                    Grundsteuererklärung starten
                  </a>
                  .
                </p>
              </>
            )}
          </Form>
        </div>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
