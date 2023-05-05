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

const SURVEY_ID = "survey";
const SURVEY_CATEGORY = "success";
const DEVICE_QUESTIONAIRE = "/bundesIdent/device";

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
  const userSurvey = formData.get(SURVEY_ID);

  invariant(
    typeof userSurvey === "string",
    "expected formData to include survey/feedback text area of type string"
  );

  if (isEmpty(userSurvey)) {
    return redirect(DEVICE_QUESTIONAIRE);
  }

  await createSurvey("success", userSurvey);
  return redirect(DEVICE_QUESTIONAIRE);
};

export default function SurveySuccess() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <ContentContainer size="sm-md">
      <BreadcrumbNavigation />
      <Headline>
        Wieso war die Identifikation nicht super? An welcher Stelle hatten Sie
        bei der Identifikation Schwierigkeiten?
      </Headline>
      <div className="mb-24">
        <p className="text-18 leading-26">
          Ihr Feedback hilft uns, das Produkt zu verbessern. Geben Sie nicht
          Ihren Namen und auch nicht Ihre E‑Mail-Adresse ein.
        </p>
      </div>
      <Form method="post">
        <fieldset disabled={isSubmitting}>
          <div className="mb-32">
            <label htmlFor={SURVEY_ID} className="block mb-4 text-gray-900">
              Feedback (max. Zeichen 900)
            </label>
            <Textarea
              className="h-[110px]"
              maxLength={900}
              name={SURVEY_ID}
              placeholder="Feedback"
              data-testid={`${SURVEY_ID}-${SURVEY_CATEGORY}-textarea`}
            />
          </div>
          <ButtonContainer className="lg:max-w-[392px]">
            <Button className="w-full lg:max-w-[216px]" look="primary">
              Übernehmen & weiter
            </Button>
            <Button
              className="w-full lg:max-w-[152px]"
              look="tertiary"
              to={DEVICE_QUESTIONAIRE}
            >
              Überspringen
            </Button>
          </ButtonContainer>
        </fieldset>
      </Form>
    </ContentContainer>
  );
}
