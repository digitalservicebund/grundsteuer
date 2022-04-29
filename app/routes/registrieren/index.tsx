import { ActionFunction, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from "~/domain/validation";
import { createUser, userExists } from "~/domain/user";
import { Button, FormGroup, Input, SimplePageLayout } from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { removeUndefined } from "~/util/removeUndefined";

const validateInputEmail = async (normalizedEmail: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateEmail({ value: normalizedEmail }) && "errors.email.wrongFormat") ||
  ((await userExists(normalizedEmail)) && "errors.email.alreadyExists");

const validateInputPassword = (normalizedEmail: string, password: string) =>
  (!validateRequired({ value: normalizedEmail }) && "errors.required") ||
  (!validateMinLength({ value: password, minLength: 8 }) &&
    "errors.password.tooShort") ||
  (!validateMaxLength({ value: password, maxLength: 64 }) &&
    "errors.password.tooLong");

export const action: ActionFunction = async ({ request }) => {
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

    password: validateInputPassword(normalizedEmail, password),

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

  return (
    <SimplePageLayout>
      <h1 className="text-32 leading-40 mb-64">
        Erstellen Sie jetzt ein Konto für Ihre Grundsteuererklärung
      </h1>

      <Form method="post" noValidate>
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

        <Button>Konto anlegen</Button>
      </Form>
    </SimplePageLayout>
  );
}
