import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Headline,
  RadioGroup,
} from "~/components";
import ErrorBar from "~/components/ErrorBar";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle(
      "Haben Sie die Grundsteuererklärung auf dem Computer bzw. Tablet angefangen?"
    ),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userAnswer = formData.get("startAnswer");

  if (userAnswer === "startDesktop") {
    return redirect("/bundesIdent/backtodesktop");
  }

  if (userAnswer === "startMobile") {
    return redirect("/formular/welcome");
  }

  return {
    error: "noAnswer",
  };
};

export default function Device() {
  const actionData = useActionData();
  const error = actionData?.error;

  const listOfDeviceAnwers = [
    {
      value: "startDesktop",
      label: "Ja, ich habe auf dem Computer bzw. Tablet angefangen",
    },
    {
      value: "startMobile",
      label: "Nein, ich habe auf dem Smartphone angefangen",
    },
  ];

  return (
    <ContentContainer size="sm-md">
      <div data-testid="bundesident-device">
        <Headline>
          Haben Sie die Grundsteuererklärung auf dem Computer bzw. Tablet
          angefangen?
        </Headline>
        <div className="mb-32">
          <p className="text-18 leading-26">
            Falls Sie am Computer bzw. Tablet schon Formulardaten eingegeben
            haben, sollten Sie dort fortfahren. Der Grund: Ihre Formulardaten
            werden nur lokal im Cookie des Browsers gespeichert.
          </p>
        </div>
        {error && (
          <ErrorBar heading="Es ist ein Fehler aufgetreten." className="mb-32">
            Überprüfen Sie Ihre Eingaben.
          </ErrorBar>
        )}
        <Form method="post">
          <FormGroup>
            <RadioGroup
              name="startAnswer"
              options={listOfDeviceAnwers}
              error={error && "Bitte treffen Sie eine Auswahl"}
            />
          </FormGroup>
          <ButtonContainer className="mt-32">
            <div className="justify-start">
              <Button className="w-full lg:max-w-[216px]" look="primary">
                Übernehmen & weiter
              </Button>
            </div>
          </ButtonContainer>
        </Form>
      </div>
    </ContentContainer>
  );
}
