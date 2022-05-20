import { ActionFunction, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import {
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validateRequired,
} from "~/domain/validation";
import { createUser, userExists } from "~/domain/user";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  FormGroup,
  Headline,
  Input,
  IntroText,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { removeUndefined } from "~/util/removeUndefined";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { getSession } from "~/session.server";
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";

const validateInputEmail = async (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat") ||
  ((await userExists(normalizedEmail)) && "errors.email.alreadyExists");

const validateInputPassword = (password: string) =>
  (!validateRequired({ value: password }) && "errors.required") ||
  (!validateMinLength({ value: password, minLength: 8 }) &&
    "errors.password.tooShort") ||
  (!validateMaxLength({ value: password, maxLength: 64 }) &&
    "errors.password.tooLong");

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
  const session = await getSession(request.headers.get("Cookie"));
  await verifyCsrfToken(request, session);

  const formData = await request.formData();

  const email = formData.get("email");
  const emailRepeated = formData.get("emailRepeated");
  const password = formData.get("password");
  const passwordRepeated = formData.get("passwordRepeated");

  invariant(
    typeof email === "string",
    "expected formData to include email field of type string"
  );
  invariant(
    typeof emailRepeated === "string",
    "expected formData to include emailRepeated field of type string"
  );
  invariant(
    typeof password === "string",
    "expected formData to include password field of type string"
  );
  invariant(
    typeof passwordRepeated === "string",
    "expected formData to include passwordRepeated field of type string"
  );

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedEmailRepeated = emailRepeated.trim().toLowerCase();

  const errors = {
    email: await validateInputEmail(normalizedEmail),

    emailRepeated:
      normalizedEmail !== normalizedEmailRepeated && "errors.email.notMatching",

    password: validateInputPassword(password),

    passwordRepeated:
      password !== passwordRepeated && "errors.password.notMatching",
  };

  const errorsExist =
    errors.email ||
    errors.emailRepeated ||
    errors.password ||
    errors.passwordRepeated;

  if (!errorsExist) {
    await createUser(normalizedEmail, password);
    await saveAuditLog({
      eventName: AuditLogEvent.USER_REGISTERED,
      timestamp: Date.now(),
      ipAddress: clientIp,
      username: normalizedEmail,
    });
    return redirect("/registrieren/erfolgreich");
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
          unterbrechen und später fortsetzen. Wichtig: Die Weiterbearbeitung ist
          nur mit dem Gerät und dem Browser möglich, mit denen das Konto
          erstellt wurde. Der Grund: Ihre Formulardaten werden nur im Cookie in
          Ihrem Browser gespeichert.
        </IntroText>

        {errors && <ErrorBarStandard />}

        <Form method="post" noValidate>
          <CsrfToken />
          <FormGroup>
            <Input
              type="email"
              name="email"
              label="E-Mail-Adresse"
              error={t(errors?.email)}
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="password"
              name="password"
              label="Passwort"
              error={t(errors?.password)}
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="email"
              name="emailRepeated"
              label="E-Mail-Adresse wiederholen"
              error={t(errors?.emailRepeated)}
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="password"
              name="passwordRepeated"
              label="Passwort wiederholen"
              error={t(errors?.passwordRepeated)}
            />
          </FormGroup>

          <Button disabled={isSubmitting}>Weiter</Button>
        </Form>
      </ContentContainer>
    </UserLayout>
  );
}
