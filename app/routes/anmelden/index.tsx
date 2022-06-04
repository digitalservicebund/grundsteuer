import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  json,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
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
import { getSession, commitSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { userExists } from "~/domain/user";
import { sendLoginAttemptEmail } from "~/email.server";

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
  const registered = url.searchParams.get("registered");

  return json(
    {
      csrfToken,
      userIsComingfromSuccessfulRegistration: registered && registered === "1",
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
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
  if (await userExists(normalizedEmail)) {
    return await authenticator.authenticate(
      process.env.APP_ENV === "test" ? "form" : "email-link",
      request,
      {
        successRedirect: "/anmelden/email",
      }
    );
  } else {
    sendLoginAttemptEmail({ emailAddress: normalizedEmail });
    console.log("unknown email!");
    return redirect("/anmelden/email");
  }
};

export default function Anmelden() {
  const loaderData = useLoaderData();
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
        <IntroText>
          Bitte geben Sie die E-Mail-Adresse ein, mit der Sie sich bei uns
          registriert haben. Wir schicken Ihnen dann eine E-Mail mit einem
          speziellen Link zu, mit dem Sie sich anmelden können.
        </IntroText>
        <div className="mb-80">
          <Form method="post" noValidate>
            <CsrfToken value={loaderData.csrfToken} />
            <div>
              <FormGroup>
                <Input type="email" name="email" label="E-Mail-Adresse" />
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
