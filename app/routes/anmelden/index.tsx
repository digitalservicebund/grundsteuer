import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
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
  LoggedOutLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { userExists } from "~/domain/user";
import ErrorBar from "~/components/ErrorBar";
import EmailOutlined from "~/components/icons/mui/EmailOutlined";
import Hint from "~/components/Hint";
import { useTranslation } from "react-i18next";
import { removeUndefined } from "~/util/removeUndefined";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { validateRequired } from "~/domain/validation/requiredValidation";
import { validateEmail } from "~/domain/validation/stringValidation";
import * as crypto from "crypto";
import { flags } from "~/flags.server";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";
import Help from "~/components/form/help/Help";
import DefaultHelpContent from "~/components/form/help/Default";

const validateInputEmail = async (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat") ||
  (!(await userExists(normalizedEmail)) && "errors.email.unknown");

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
      flags: flags.getAllFlags(),
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "anmelden", 20);
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
    email: await validateInputEmail(normalizedEmail),
  };
  const errorsExist = Object.keys(removeUndefined(errors)).length > 0;
  if (errorsExist) {
    return {
      errors: removeUndefined(errors),
    };
  }

  let successRedirect = `/email/dispatcher/anmelden/${crypto
    .createHash("sha1")
    .update(normalizedEmail)
    .digest("hex")}`;
  if (process.env.SKIP_AUTH === "true") {
    successRedirect = "/formular";
  }

  return authenticator.authenticate(
    process.env.SKIP_AUTH === "true" ? "form" : "email-link",
    request,
    {
      successRedirect,
    }
  );
};

export default function Anmelden() {
  const { t } = useTranslation("all");
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <LoggedOutLayout flags={loaderData.flags}>
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

        <Headline>Willkomen zurück!</Headline>
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
              />
              <Help>
                <ul className="list-disc px-16">
                  <li>
                    Nutzen Sie die E-Mail Adresse, mit der Sie sich{" "}
                    <strong>registriert</strong> haben
                  </li>
                  <li>
                    Prüfen Sie die eingegebene Adresse auf Tippfehler und die
                    richtige Schreibweise
                  </li>
                  {/* no article yet <li>
                    Wenn Sie Ihr Konto länger als 4 Monate nicht genutzt haben,
                    wurde es gelöscht. Was Sie jetzt tun können, lesen Sie in
                    unserem{" "}
                    <a
                      href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/"
                      className="underline font-bold"
                      target="_blank"
                    >
                      Hilfebereich
                    </a>
                  </li> */}
                </ul>
              </Help>
            </div>
            <Button
              data-testid="submit"
              icon={<EmailOutlined />}
              disabled={isSubmitting}
              className="mb-32"
            >
              Anmelde-Link senden
            </Button>
          </Form>
        </div>
        <div className="mb-56 text-18">
          <p className="mb-8">
            Hier können Sie die Registrierung für ein neues Nutzerkonto starten.
          </p>
          <a
            href="/pruefen/start"
            className="underline text-blue-800 font-bold"
          >
            Neues Konto erstellen
          </a>
        </div>

        <div className="mb-192 text-18">
          {/* no article yet
          <p className="mb-8">
            Keine Adresse funktioniert? In unserem Hilfebereich finden Sie einen
            Artikel mit Lösungsvorschlägen.
          </p>
          <a
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/"
            className="underline text-blue-800 font-bold"
            target="_blank"
          >
            Zum Hilfebereich
          </a> */}
        </div>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
