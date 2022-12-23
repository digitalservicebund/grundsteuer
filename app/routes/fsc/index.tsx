import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { findUserByEmail } from "~/domain/user";
import { authenticator } from "~/auth.server";
import { canEnterFsc } from "~/domain/identificationStatus";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  FormGroup,
  Headline,
  RadioGroup,
} from "~/components";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { t } from "i18next";
import { validateRequired } from "~/domain/validation/requiredValidation";
import { removeUndefined } from "~/util/removeUndefined";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { FscRequest } from "~/domain/fscRequest";
import FscLetterHint from "~/components/fsc/FscLetterHint";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (!canEnterFsc(dbUser)) {
    return redirect("/fsc/beantragen");
  }

  invariant(dbUser.fscRequest, "expected an fscRequest in database for user");

  const antragStatus = new FscRequest(dbUser.fscRequest).getAntragStatus();
  if (antragStatus.remainingDays >= 90 || antragStatus.remainingDays <= 0) {
    return redirect("/fsc/eingeben");
  }

  return json(
    {
      csrfToken: createCsrfToken(session),
      ...antragStatus,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  await verifyCsrfToken(request);

  // clone request before accessing formData, as remix-auth also needs the formData
  // and it can only be accessed once
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const fscReceived = (formData.get("fscReceived") as string) || undefined;

  const errors = {
    fscReceived:
      !validateRequired({ value: fscReceived || "" }) && "errors.required",
  };
  const errorsExist = Object.keys(removeUndefined(errors)).length > 0;
  if (errorsExist) {
    return {
      errors: removeUndefined(errors),
    };
  }
  if (fscReceived === "false") {
    return redirect("/fsc/hilfe");
  }
  return redirect("/fsc/eingeben");
};

export default function FscIndex() {
  const { antragDate, letterArrivalDate, csrfToken } = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const isSubmitting = Boolean(useTransition().submission);

  return (
    <ContentContainer size="sm-md">
      <BreadcrumbNavigation />
      <Form method="post" noValidate className="mb-80">
        <CsrfToken value={csrfToken} />
        <fieldset>
          <Headline asLegend>
            Haben Sie Ihren Brief mit dem Freischaltcode schon erhalten?
          </Headline>
          <FscLetterHint
            antragDate={antragDate}
            letterArrivalDate={letterArrivalDate}
          />

          {errors && !isSubmitting && <ErrorBarStandard />}

          <ContentContainer size="sm">
            <FormGroup>
              <RadioGroup
                name="fscReceived"
                label=""
                error={t(errors?.fscReceived)}
                options={[
                  {
                    value: "true",
                    label:
                      "Ja, meinen Brief mit dem Freischaltcode habe ich erhalten",
                  },
                  {
                    value: "false",
                    label:
                      "Nein, bisher ist kein Brief mit dem Freischaltcode angekommen",
                  },
                ]}
              />
            </FormGroup>
          </ContentContainer>
        </fieldset>
        <Button id="nextButton" disabled={isSubmitting}>
          Übernehmen & Weiter
        </Button>
      </Form>
    </ContentContainer>
  );
}
