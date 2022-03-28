// app/routes/login.tsx
import { Form, ActionFunction, LoaderFunction, useActionData } from "remix";
import { useTranslation } from "react-i18next";
import { AuthorizationError } from "remix-auth";
// import invariant from "tiny-invariant";
import { authenticator } from "~/auth.server";
import { Button, FormGroup, Input, SimplePageLayout } from "~/components";
// import { validateEmail, validateRequired } from "~/domain/validation";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/formular",
  });
};

export const action: ActionFunction = async ({ request }) => {
  // const formData = await request.formData();

  // const email = formData.get("email");
  // const password = formData.get("password");

  // invariant(
  //   typeof email === "string",
  //   "expected formData to include email field of type string"
  // );
  // invariant(
  //   typeof password === "string",
  //   "expected formData to include password field of type string"
  // );

  // const errors = {
  //   email:
  //     (!validateRequired(email) && "errors.required") ||
  //     (!validateEmail(email) && "errors.email.wrongFormat"),

  //   password: !validateRequired(email) && "errors.required",
  // };

  // const errorsExist = errors.email || errors.password;

  // if (!errorsExist) {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/formular",
      throwOnError: true,
    });
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return { error: true };
    }
  }
  // }

  //   const filteredErrors = Object.entries(errors).reduce((acc, [k, v]) => {
  //     return v ? { ...acc, [k]: v } : acc;
  //   }, {});

  //   return {
  //     errors: filteredErrors,
  //   };
};

export default function Anmelden() {
  const { t } = useTranslation();
  const actionData = useActionData();
  const errors = actionData?.errors;

  return (
    <SimplePageLayout>
      {actionData?.error && (
        <div className="bg-red-200 border-2 border-red-800 p-16 mb-32">
          E-Mail-Adresse und/oder Passwort falsch.
        </div>
      )}
      <Form method="post" noValidate>
        <FormGroup>
          <Input
            type="email"
            name="email"
            label="E-Mail-Adresse"
            error={t(errors?.email)}
            help="Für erfolgreiches Anmelden: user@example.com (Passwort egal)"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            label="Passwort"
            error={t(errors?.password)}
          />
        </FormGroup>
        <Button data-testid="submit">Anmelden</Button>
      </Form>
    </SimplePageLayout>
  );
}
