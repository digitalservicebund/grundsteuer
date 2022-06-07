import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  FormGroup,
  Headline,
  Input,
  IntroText,
  SubHeadline,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import ErrorBar from "~/components/ErrorBar";
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";

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
  await verifyCsrfToken(request);
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
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>
          Herzlich willkommen!
          <br />
          Bitte melden Sie sich an.
        </Headline>
        {actionData?.error && (
          <ErrorBar className="mb-32">
            E-Mail-Adresse und/oder Passwort falsch.
          </ErrorBar>
        )}
        <div className="mb-80">
          <Form method="post" noValidate>
            <CsrfToken />
            <div>
              <FormGroup>
                <Input type="email" name="email" label="E-Mail-Adresse" />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  name="password"
                  label="Passwort"
                  autoComplete="current-password"
                />
              </FormGroup>
            </div>
            <Button data-testid="submit" disabled={isSubmitting}>
              Einloggen
            </Button>
          </Form>
        </div>

        {!loaderData?.userIsComingfromSuccessfulRegistration && (
          <div>
            <SubHeadline>Noch nicht registriert?</SubHeadline>
            <IntroText className="!mb-64">
              Erstellen Sie ein Konto um die Bearbeitung nach Wunsch
              unterbrechen- und wieder fortsetzen zu können.
            </IntroText>
            <Button to="/registrieren" look="tertiary">
              Konto erstellen
            </Button>
          </div>
        )}
      </ContentContainer>
    </UserLayout>
  );
}
