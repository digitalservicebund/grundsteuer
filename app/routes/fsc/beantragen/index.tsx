import { useEffect, useState } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Headline,
  MaskedInput,
  IntroText,
  Spinner,
} from "~/components";
import {
  requestNewFreischaltCode,
  retrieveAntragsId,
} from "~/erica/freischaltCodeBeantragen";

import {
  deleteEricaRequestIdFscBeantragen,
  findUserByEmail,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { removeUndefined } from "~/util/removeUndefined";
import {
  getErrorMessageForGeburtsdatum,
  getErrorMessageForSteuerId,
} from "~/domain/validation";
import SteuerIdField from "~/components/form/SteuerIdField";

const isEricaRequestInProgress = async (userData: User) => {
  return Boolean(userData.ericaRequestIdFscBeantragen);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return Boolean(userData.fscRequest);
};

const getEricaRequestIdFscBeantragen = async (userData: User) => {
  invariant(
    userData.ericaRequestIdFscBeantragen,
    "ericaRequestIdFscBeantragen is null"
  );
  return userData.ericaRequestIdFscBeantragen;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  const ericaRequestInProgress = await isEricaRequestInProgress(userData);

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (ericaRequestInProgress) {
    const elsterRequestIdOrError = await retrieveAntragsId(
      await getEricaRequestIdFscBeantragen(userData)
    );
    if (elsterRequestIdOrError) {
      if (typeof elsterRequestIdOrError == "string") {
        await saveFscRequest(user.email, elsterRequestIdOrError);
        await deleteEricaRequestIdFscBeantragen(user.email);
      } else if (elsterRequestIdOrError?.errorType == "EricaUserInputError") {
        await deleteEricaRequestIdFscBeantragen(user.email);
        return {
          showError: true,
          showSpinner: false,
        };
      } else {
        await deleteEricaRequestIdFscBeantragen(user.email);
        throw new Error(elsterRequestIdOrError?.errorType);
      }
    }
  }

  return {
    showError: false,
    showSpinner: ericaRequestInProgress,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (await isEricaRequestInProgress(userData)) return {};

  const formData = await request.formData();
  const steuerId = formData.get("steuerId");
  const geburtsdatum = formData.get("geburtsdatum");

  invariant(
    typeof steuerId === "string",
    "expected formData to include steuerId field of type string"
  );
  invariant(
    typeof geburtsdatum === "string",
    "expected formData to include geburtsdatum field of type string"
  );

  const normalizedSteuerId = steuerId.replace(/[\s/]/g, "");
  const normalizedGeburtsdatum = geburtsdatum.replace(/\s/g, "");

  const errors = {
    steuerId: await getErrorMessageForSteuerId(normalizedSteuerId),
    geburtsdatum: await getErrorMessageForGeburtsdatum(normalizedGeburtsdatum),
  };

  const errorsExist = errors.steuerId || errors.geburtsdatum;

  if (errorsExist) {
    return json({
      errors: removeUndefined(errors),
    });
  }

  const ericaRequestId = await requestNewFreischaltCode(
    normalizedSteuerId,
    normalizedGeburtsdatum
  );
  await saveEricaRequestIdFscBeantragen(user.email, ericaRequestId);

  return {};
};

export default function FscBeantragen() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;
  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  const [showSpinner, setShowSpinner] = useState(loaderData?.showSpinner);
  const [showError, setShowError] = useState(loaderData?.showError);

  useEffect(() => {
    if (fetcher.data) {
      setShowSpinner(fetcher.data.showSpinner);
      setShowError(fetcher.data.showError);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (loaderData) {
      setShowSpinner(loaderData.showSpinner);
      setShowError(loaderData.showError);
    }
  }, [loaderData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showSpinner) {
        fetcher.load("/fsc/beantragen?index");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <Headline>Beantragen Sie Ihren persönlichen Freischaltcode.</Headline>

      <IntroText>
        Nur mit einem Freischaltcode können Sie Ihre Grundsteuererklärung nach
        Eingabe aller Daten absenden. Mit Eingabe des Codes bestätigen Sie Ihre
        Identität, das heißt: Wir wissen, dass keine andere Person
        widerrechtlich die Grundsteuererklärung abgibt.
      </IntroText>

      {showError && (
        <div className="p-16 mb-32 bg-red-200 border-2 border-red-800">
          Mit diesen Daten können wir keinen FSC beantragen.
        </div>
      )}

      <Form method="post">
        <div>
          <FormGroup>
            <SteuerIdField
              name="steuerId"
              label="Steuer-Identifikationsnummer"
              error={errors?.steuerId}
            />
          </FormGroup>
          <FormGroup>
            <MaskedInput
              mask="Date"
              name="geburtsdatum"
              label="Geburtsdatum"
              placeholder="TT.MM.JJJJ"
              error={errors?.geburtsdatum}
              className="w-1/2"
            />
          </FormGroup>
        </div>
        <ButtonContainer forceMultiline>
          <Button disabled={isSubmitting || showSpinner}>
            Freischaltcode beantragen
          </Button>
          <Button look="secondary" to="/formular/welcome">
            Später beantragen
          </Button>
        </ButtonContainer>
      </Form>
      {showSpinner && (
        <Spinner
          initialText={"Ihr Freischaltcode wird beantragt."}
          waitingText={
            "Das Beantragen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
          }
          longerWaitingText={
            "Wir beantragen weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
          }
        />
      )}
    </ContentContainer>
  );
}
