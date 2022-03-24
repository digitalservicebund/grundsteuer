import { ActionFunction, Form, redirect, useActionData } from "remix";
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

  const errors = {
    email:
      (!validateRequired(email) && "errors.required") ||
      (!validateEmail(email) && "errors.email.wrongFormat") ||
      ((await userExists(email)) && "errors.email.alreadyExists"),

    emailRepeated:
      email.trim().toLowerCase() !== emailRepeated.trim().toLowerCase() &&
      "errors.email.notMatching",

    password:
      (!validateRequired(email) && "errors.required") ||
      (!validateMinLength(password, 8) && "errors.password.tooShort") ||
      (!validateMaxLength(password, 64) && "errors.password.tooLong"),

    passwordRepeated:
      password !== passwordRepeated && "errors.password.notMatching",
  };

  const errorsExist =
    errors.email ||
    errors.emailRepeated ||
    errors.password ||
    errors.passwordRepeated;

  if (!errorsExist) {
    await createUser(email, password);
    return redirect("/registrieren/erfolgreich");
  }

  const filteredErrors = Object.entries(errors).reduce((acc, [k, v]) => {
    return v ? { ...acc, [k]: v } : acc;
  }, {});

  return {
    errors: filteredErrors,
  };
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
            labelText="E-Mail-Adresse"
            errorMessage={t(errors?.email)}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="password"
            name="password"
            labelText="Passwort"
            errorMessage={t(errors?.password)}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="email"
            name="emailRepeated"
            labelText="E-Mail-Adresse wiederholen"
            errorMessage={t(errors?.emailRepeated)}
          />
        </FormGroup>

        <FormGroup>
          <Input
            type="password"
            name="passwordRepeated"
            labelText="Passwort wiederholen"
            errorMessage={t(errors?.passwordRepeated)}
          />
        </FormGroup>

        <Button>Konto anlegen</Button>
      </Form>
    </SimplePageLayout>
  );
}
