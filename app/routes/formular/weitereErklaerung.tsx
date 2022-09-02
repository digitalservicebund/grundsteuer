import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  FormGroup,
  Headline,
  IntroText,
  RadioGroup,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { removeUndefined } from "~/util/removeUndefined";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { commitSession, getSession } from "~/session.server";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import Hint from "~/components/Hint";
import {
  createHeadersWithFormDataCookie,
  getStoredFormData,
} from "~/formDataStorage.server";
import { authenticator } from "~/auth.server";
import {
  deletePdf,
  deleteTransferticket,
  setUserInDeclarationProcess,
} from "~/domain/user";
import { validateRequired } from "~/domain/validation/requiredValidation";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = createCsrfToken(session);
  return json(
    {
      csrfToken,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));

  await verifyCsrfToken(request);

  // clone request before accessing formData, as remix-auth also needs the formData
  // and it can only be accessed once
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const datenUebernehmen = formData.get("datenUebernehmen");

  if (datenUebernehmen) {
    invariant(
      typeof datenUebernehmen === "string",
      "expected formData to include datenUebernehmen field of type string or undefined"
    );
  }

  const errors = {
    datenUebernehmen:
      !validateRequired({ value: datenUebernehmen || "" }) && "errors.required",
  };

  const errorsExist = Object.keys(removeUndefined(errors)).length > 0;

  if (!errorsExist) {
    await deletePdf(user.email);
    await deleteTransferticket(user.email);
    await setUserInDeclarationProcess(user.email, true);
    session.set(
      "user",
      Object.assign(session.get("user"), { inDeclarationProcess: true })
    );
    const storedFormData = await getStoredFormData({ request, user });
    let formDataToBeStored = {};
    if (datenUebernehmen == "true") {
      formDataToBeStored = {
        eigentuemer: {
          person: [
            {
              persoenlicheAngaben:
                storedFormData.eigentuemer?.person?.[0].persoenlicheAngaben,
              adresse: storedFormData.eigentuemer?.person?.[0].adresse,
              steuerId: storedFormData.eigentuemer?.person?.[0].steuerId,
              vertreter: storedFormData.eigentuemer?.person?.[0].vertreter,
              gesetzlicherVertreter:
                storedFormData.eigentuemer?.person?.[0].gesetzlicherVertreter,
            },
          ],
        },
      };
    }
    const headers = await createHeadersWithFormDataCookie({
      data: formDataToBeStored,
      user,
    });
    headers?.append("Set-Cookie", await commitSession(session));

    return redirect("/pruefen/start?weitereErklaerung=true", {
      headers,
    });
  }

  return {
    errors: removeUndefined(errors),
  };
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Weitere Erklärung abgeben") };
};

export default function WeitereErklaerung() {
  const { t } = useTranslation("all");
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <ContentContainer size="sm-md">
      <BreadcrumbNavigation />
      <Hint className="mb-40">
        Bitte stellen Sie sicher, das Sie das Transferticket und die PDF Ihrer
        Grundsteuererklärung heruntergeladen haben.
      </Hint>

      <Form method="post" noValidate className="mb-80">
        <CsrfToken value={loaderData.csrfToken} />
        <fieldset>
          <ContentContainer size="sm">
            <Headline asLegend>
              Sollen die Daten von Eigentümer:in 1 für die neue Erklärung
              übernommen werden?
            </Headline>
            <IntroText>
              Dies umfasst die Angaben zu persönlichen Daten, Postadresse und
              Steueridentifikationsnummer.
            </IntroText>
          </ContentContainer>

          {errors && !isSubmitting && <ErrorBarStandard />}

          <FormGroup>
            <RadioGroup
              name="datenUebernehmen"
              label=""
              error={t(errors?.datenUebernehmen)}
              options={[
                {
                  value: "true",
                  label: "Ja, diese Angaben für die neue Erklärung übernehmen",
                },
                {
                  value: "false",
                  label: "Nein, keine Angaben übernehmen und Formular leeren",
                },
              ]}
            />
          </FormGroup>
        </fieldset>
        <Button id="nextButton" disabled={isSubmitting}>
          Verstanden & neue Erklärung starten
        </Button>
      </Form>
    </ContentContainer>
  );
}
