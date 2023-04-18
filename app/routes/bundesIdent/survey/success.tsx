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
const SURVEY_CATEGORY = "success";
const FORMULAR_PATH = "/formular/welcome";

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
    return redirect(FORMULAR_PATH);
  }

  await createSurvey("success", userSurvey);
  return redirect(FORMULAR_PATH);
};

export default function SurveySuccess() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <ContentContainer size="sm-md">
      <BreadcrumbNavigation />
      <Headline>
        Was sollte an der Identifikation mit dem Ausweis verbessert werden?
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
              Feedback (max. Zeichen 900)
            </label>
            <Textarea
              className="h-[110px]"
              maxLength={900}
              name={SURVEY}
              placeholder="Feedback"
              data-testid={`${SURVEY}-${SURVEY_CATEGORY}-textarea`}
            />
          </div>
          <ButtonContainer className="lg:max-w-[412px]">
            <Button className="w-full lg:max-w-[216px]" look="primary">
              Übernehmen & weiter
            </Button>
            <Button
              className="w-full lg:max-w-[152px]"
              look="tertiary"
              to={FORMULAR_PATH}
            >
              Überspringen
            </Button>
          </ButtonContainer>
        </fieldset>
      </Form>
    </ContentContainer>
  );
}
