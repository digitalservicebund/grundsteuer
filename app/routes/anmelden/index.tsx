import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/auth.server";
import {
  Button,
  ContentContainer,
  Headline,
  Input,
  SubHeadline,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Anmelden") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/formular/welcome",
  });

  const url = new URL(request.url);
  const registered = url.searchParams.get("registered");

  return {
    userIsComingfromSuccessfulRegistration: registered && registered === "1",
  };
};

export const action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/fsc",
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
  const loaderData = useLoaderData();
  const actionData = useActionData();

  return (
    <UserLayout>
      <ContentContainer size="sm">
        <Headline>
          Herzlich willkommen!
          <br />
          Bitte melden Sie sich an.
        </Headline>
        {actionData?.error && (
          <div className="p-16 mb-32 bg-red-200 border-2 border-red-800">
            E-Mail-Adresse und/oder Passwort falsch.
          </div>
        )}
        <div className="mb-64">
          <Form method="post" noValidate>
            <div>
              <Input type="email" name="email" label="E-Mail-Adresse" />
              <Input
                type="password"
                name="password"
                label="Passwort"
                autoComplete="current-password"
              />
            </div>
            <Button data-testid="submit">Einloggen</Button>
          </Form>
        </div>

        {!loaderData?.userIsComingfromSuccessfulRegistration && (
          <div>
            <SubHeadline>Noch nicht registriert?</SubHeadline>
            <Button to="/registrieren">Konto erstellen</Button>
          </div>
        )}
      </ContentContainer>
    </UserLayout>
  );
}
