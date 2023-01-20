import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Trans, useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { createUser, userExists } from "~/domain/user";
import {
  BreadcrumbNavigation,
  Button,
  Checkbox,
  ContentContainer,
  FormGroup,
  Headline,
  Input,
  IntroText,
  SubHeadline,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { removeUndefined } from "~/util/removeUndefined";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { authenticator } from "~/auth.server";
import Hint from "~/components/Hint";
import { validateRequired } from "~/domain/validation/requiredValidation";
import { validateEmail } from "~/domain/validation/stringValidation";
import * as crypto from "crypto";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";
import { PRUEFEN_START_PATH } from "~/routes/__infoLayout/pruefen/_pruefenPath.server";

const validateInputEmail = (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat") ||
  (!(
    process.env.APP_ENV === "production" ||
    /@digitalservice.bund.de/.test(normalizedEmail)
  ) &&
    "errors.email.notAllowed");

export const saveAuditLogs = async (
  clientIp: string,
  email: string,
  data: {
    confirmDataPrivacy: string | null;
    confirmTermsOfUse: string | null;
    confirmEligibilityCheck: string | null;
  }
) => {
  invariant(
    data.confirmDataPrivacy == "true",
    "confirmDataPrivacy should be checked"
  );
  invariant(
    data.confirmTermsOfUse == "true",
    "confirmTermsOfUse should be checked"
  );
  invariant(
    data.confirmEligibilityCheck == "true",
    "confirmEligibilityCheck should be checked"
  );

  await saveAuditLog({
    eventName: AuditLogEvent.USER_REGISTERED,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
  });
  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_DATA_PRIVACY_REGISTRATION,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.confirmDataPrivacy,
    },
  });
  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_TERMS_OF_USE_REGISTRATION,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.confirmTermsOfUse,
    },
  });
  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_ELIGIBLE_TO_USE_REGISTRATION,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.confirmEligibilityCheck,
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = createCsrfToken(session);
  return json(
    {
      csrfToken,
      pruefenPath: PRUEFEN_START_PATH,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "registrieren", 20);
  await verifyCsrfToken(request);

  // clone request before accessing formData, as remix-auth also needs the formData
  // and it can only be accessed once
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const email = formData.get("email");
  const confirmDataPrivacy = formData.get("confirmDataPrivacy");
  const confirmTermsOfUse = formData.get("confirmTermsOfUse");
  const confirmEligibilityCheck = formData.get("confirmEligibilityCheck");

  invariant(
    typeof email === "string",
    "expected formData to include email field of type string"
  );
  invariant(
    typeof confirmDataPrivacy === "string" || confirmDataPrivacy == null,
    "expected formData to include confirmDataPrivacy field of type string"
  );
  invariant(
    typeof confirmTermsOfUse === "string" || confirmTermsOfUse == null,
    "expected formData to include confirmTermsOfUse field of type string"
  );
  invariant(
    typeof confirmEligibilityCheck === "string" ||
      confirmEligibilityCheck == null,
    "expected formData to include confirmEligibilityCheck field of type string"
  );

  const normalizedEmail = email.trim().toLowerCase();

  const errors = {
    email: validateInputEmail(normalizedEmail),
    confirmDataPrivacy:
      !validateRequired({ value: confirmDataPrivacy || "" }) &&
      "errors.required",
    confirmTermsOfUse:
      !validateRequired({ value: confirmTermsOfUse || "" }) &&
      "errors.required",
    confirmEligibilityCheck:
      !validateRequired({ value: confirmEligibilityCheck || "" }) &&
      "errors.required",
  };

  const errorsExist = Object.keys(removeUndefined(errors)).length > 0;

  if (!errorsExist) {
    if (await userExists(normalizedEmail)) {
      console.log("already registered email!");
    } else {
      const newUser = await createUser(normalizedEmail);
      await saveAuditLogs(clientIp, normalizedEmail, {
        confirmDataPrivacy,
        confirmTermsOfUse,
        confirmEligibilityCheck,
      });
      console.log(`Registered new user with id ${newUser?.id}`);
    }

    let successRedirect = `/email/dispatcher/registrieren/${crypto
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
        throwOnError: true,
      }
    );
  }

  return {
    errors: removeUndefined(errors),
  };
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrieren") };
};

export default function Registrieren() {
  const { t } = useTranslation("all");
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  return (
    <ContentContainer>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>
          Erstellen Sie jetzt ein Konto für Ihre Grundsteuererklärung.
        </Headline>

        <IntroText>
          Mit einem Konto können Sie die Bearbeitung Ihrer Grundsteuererklärung
          unterbrechen und später fortsetzen. Für jede neue Anmeldung bestellen
          Sie einen neuen Anmeldelink.
        </IntroText>

        <Hint className="mb-40">
          Die Weiterbearbeitung ist nur mit dem Gerät und dem Browser möglich,
          mit dem das Konto erstellt wurde. Der Grund: Ihre Formulardaten werden
          nur im Cookie in Ihrem Browser gespeichert.
        </Hint>

        {errors && !isSubmitting && <ErrorBarStandard />}
      </ContentContainer>

      <Form method="post" noValidate className="mb-80">
        <CsrfToken value={loaderData.csrfToken} />
        <ContentContainer size="sm">
          <FormGroup>
            <Input
              type="email"
              name="email"
              label="E-Mail-Adresse"
              error={t(errors?.email)}
            />
          </FormGroup>
        </ContentContainer>
        <ContentContainer size="md">
          <SubHeadline>
            Datenschutzerklärung und Nutzungsbedingungen
          </SubHeadline>

          <div className="bg-white p-24 mb-16">
            <Checkbox
              name="confirmDataPrivacy"
              error={t(errors?.confirmDataPrivacy)}
            >
              <Trans
                components={{
                  dataPrivacyLink: (
                    <a
                      href="/datenschutz"
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                  bmfDataPrivacyLink: (
                    <a
                      href="https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Weitere_Steuerthemen/Abgabenordnung/2020-07-01-Korrektur-Allgemeine-Informationen-Datenschutz-Grundverordnung-Steuerverwaltung-anlage-1.pdf?__blob=publicationFile&v=3"
                      target="_blank"
                      rel="noopener"
                      className="font-bold underline"
                    />
                  ),
                }}
              >
                {t("zusammenfassung.fields.confirmDataPrivacy.label")}
              </Trans>
            </Checkbox>
          </div>
          <div className="bg-white p-24 mb-16">
            <Checkbox
              name="confirmTermsOfUse"
              error={t(errors?.confirmTermsOfUse)}
            >
              <Trans
                components={{
                  termsOfUseLink: (
                    <a
                      href="/nutzungsbedingungen"
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                }}
              >
                {t("zusammenfassung.fields.confirmTermsOfUse.label")}
              </Trans>
            </Checkbox>
          </div>
          <div className="bg-white p-24 mb-80">
            <Checkbox
              name="confirmEligibilityCheck"
              error={t(errors?.confirmEligibilityCheck)}
            >
              <Trans
                components={{
                  pruefenLink: (
                    <a
                      href={loaderData.pruefenPath}
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                }}
              >
                {t("zusammenfassung.fields.confirmEligibilityCheck.label")}
              </Trans>
            </Checkbox>
          </div>

          <Button disabled={isSubmitting} className="mb-48">
            Konto erstellen
          </Button>
          <p>Sie haben bereits ein Nutzerkonto?</p>
          <p>
            Hier können Sie sich{" "}
            <a href="/anmelden" className="underline text-blue-800 font-bold">
              anmelden & Bearbeitung fortsetzen
            </a>
            .
          </p>
        </ContentContainer>
      </Form>
    </ContentContainer>
  );
}
