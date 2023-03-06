import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { Form, useNavigation } from "@remix-run/react";
import { isEmpty } from "lodash";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  Textarea,
} from "~/components";
import { authenticator } from "~/auth.server";
import { createSurvey } from "~/domain/survey";
import { commitSession, getSession } from "~/session.server";

const SURVEY = "survey";
const SURVEY_CATEGORY = "dropout";
const IDENT_OPTION_PATH = "/identifikation";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("hasSurveyShown", true);

  return json(
    {
      email: sessionUser.email,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userSurvey = formData.get(SURVEY);

  invariant(
    typeof userSurvey === "string",
    "expected formData to include survey/feedback text area of type string"
  );

  if (isEmpty(userSurvey)) {
    return redirect(IDENT_OPTION_PATH);
  }

  await createSurvey("dropout", userSurvey);
  return redirect(IDENT_OPTION_PATH);
};

export default function SurveySuccess() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <Headline>
          Warum haben Sie sich gegen eine Identifikation mit dem Ausweis
          entschieden?
        </Headline>
        <div className="mb-24">
          <p className="text-18 leading-26">
            Ihr Feedback hilft uns, das Produkt zu verbessern. Bitte geben Sie
            keine personenbezogenen Daten wie zum Beispiel Name oder
            E‑Mail-Adresse ein.
          </p>
        </div>
        <Form method="post">
          <fieldset disabled={isSubmitting}>
            <div className="mb-32">
              <label htmlFor={SURVEY} className="block mb-4 text-gray-900">
                Nachricht (max. Zeichen 900)
              </label>
              <Textarea
                className="h-[110px]"
                maxLength={900}
                name={SURVEY}
                placeholder="Feedback"
                data-testid={`${SURVEY}-${SURVEY_CATEGORY}-textarea`}
              />
            </div>
            <ButtonContainer className="flex-col-reverse sm:flex-row-reverse md:max-w-[412px]">
              <Button look="tertiary" to={IDENT_OPTION_PATH}>
                Überspringen
              </Button>
              <Button look="primary">Übernehmen & weiter</Button>
            </ButtonContainer>
          </fieldset>
        </Form>
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
