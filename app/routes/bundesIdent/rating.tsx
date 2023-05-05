import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  json,
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
import { commitSession, getSession } from "~/session.server";

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

  const session = await getSession(request.headers.get("Cookie"));
  session.set("hasRatingPageShown", true);

  return json(
    {},
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userAnswer = formData.get("satisfactionAnswer");

  if (userAnswer === "answerHard" || userAnswer === "answerOk") {
    return redirect("/bundesIdent/survey/success");
  }

  if (userAnswer === "answerSuper") {
    return redirect("/bundesIdent/appreview");
  }

  return {
    error: "noAnswer",
  };
};

export default function Device() {
  const actionData = useActionData();
  const error = actionData?.error;

  const satisfactionScales = [
    {
      value: "answerHard",
      label: "Kompliziert",
    },
    {
      value: "answerOk",
      label: "Ok",
    },
    {
      value: "answerSuper",
      label: "Super",
    },
  ];

  return (
    <>
      <ContentContainer size="sm-md">
        <div data-testid="bundesident-device">
          <Headline>
            Wie fanden Sie die Identifikation mit der BundesIdent App?
          </Headline>
          {error && (
            <ErrorBar
              heading="Es ist ein Fehler aufgetreten."
              className="mb-32"
            >
              Überprüfen Sie Ihre Eingaben.
            </ErrorBar>
          )}
          <Form method="post">
            <FormGroup>
              <RadioGroup
                name="satisfactionAnswer"
                options={satisfactionScales}
                error={error && "Bitte treffen Sie eine Auswahl"}
              />
            </FormGroup>
            <ButtonContainer className="mt-32 max-w-[520px] lg:max-w-[392px]">
              <Button className="w-full lg:max-w-[216px]" look="primary">
                Übernehmen & weiter
              </Button>
              <Button
                className="w-full lg:max-w-[152px]"
                look="tertiary"
                to="/bundesIdent/device"
              >
                Überspringen
              </Button>
            </ButtonContainer>
          </Form>
        </div>
      </ContentContainer>
      <div className="mt-[60px]">
        <p className="text-18 leading-26">
          Bei Fragen oder Problemen melden Sie sich unter:{" "}
          <a
            href="mailto:hilfe@bundesident.de"
            className="font-bold text-blue-800 underline"
          >
            hilfe@bundesident.de
          </a>
        </p>
      </div>
    </>
  );
}
