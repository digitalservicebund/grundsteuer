import { Form, ActionFunction, LoaderFunction, useActionData } from "remix";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/auth.server";
import { Button, FormGroup, Input, SimplePageLayout } from "~/components";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/formular",
  });
};

export const action: ActionFunction = async ({ request }) => {
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
};

export default function Anmelden() {
  const actionData = useActionData();

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
            help="Für erfolgreiches Anmelden: user@example.com (Passwort egal)"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            label="Passwort"
          />
        </FormGroup>
        <Button data-testid="submit">Anmelden</Button>
      </Form>
    </SimplePageLayout>
  );
}
