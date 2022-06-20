import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useActionData,
  useTransition,
} from "@remix-run/react";
import { useTranslation, Trans } from "react-i18next";
import invariant from "tiny-invariant";
import { validateEmail, validateRequired } from "~/domain/validation";
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
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { removeUndefined } from "~/util/removeUndefined";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { getSession, commitSession } from "~/session.server";
import { CsrfToken, verifyCsrfToken, createCsrfToken } from "~/util/csrf";
import { authenticator } from "~/auth.server";
import WarningBar from "~/components/WarningBar";

const validateInputEmail = async (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat");

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
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
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
    email: await validateInputEmail(normalizedEmail),
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
      await createUser(normalizedEmail);
      await saveAuditLogs(clientIp, normalizedEmail, {
        confirmDataPrivacy,
        confirmTermsOfUse,
        confirmEligibilityCheck,
      });
    }

    return authenticator.authenticate(
      process.env.APP_ENV === "test" ? "form" : "email-link",
      request,
      {
        successRedirect: "/registrieren/erfolgreich",
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
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>
          Erstellen Sie jetzt ein Konto für Ihre Grundsteuererklärung.
        </Headline>

        <IntroText>
          Mit einem Konto können Sie die Bearbeitung Ihrer Grundsteuererklärung
          unterbrechen und später fortsetzen.
        </IntroText>

        <WarningBar className="mb-40">
          Die Weiterbearbeitung ist nur mit dem Gerät und dem Browser möglich,
          mit dem das Konto erstellt wurde. Der Grund: Ihre Formulardaten werden
          nur im Cookie in Ihrem Browser gespeichert.
        </WarningBar>

        {errors && <ErrorBarStandard />}
      </ContentContainer>

      <Form method="post" noValidate>
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
                      href="/pruefen/start"
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

          <Button disabled={isSubmitting}>Konto erstellen</Button>
        </ContentContainer>
      </Form>
    </UserLayout>
  );
}
