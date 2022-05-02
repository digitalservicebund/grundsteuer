import { useEffect } from "react";
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
} from "@remix-run/react";
import { authenticator } from "~/auth.server";
import {
  Button,
  ContentContainer,
  FormGroup,
  Headline,
  Input,
  IntroText,
} from "~/components";
import {
  requestNewFreischaltCode,
  retrieveAntragsId,
} from "~/erica/freischaltCode";

import {
  deleteEricaRequestIdFscBeantragen,
  findUserByEmail,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import validator from "validator";
import { useTranslation } from "react-i18next";
import { removeUndefined } from "~/util/removeUndefined";

const isEricaRequestInProgress = async (userData: User) => {
  return Boolean(userData.ericaRequestIdFscBeantragen);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return Boolean(userData.fscRequest.length > 0);
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

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (await isEricaRequestInProgress(userData)) {
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
          error: true,
          showSpinner: false,
        };
      } else {
        await deleteEricaRequestIdFscBeantragen(user.email);
        throw new Error(elsterRequestIdOrError?.errorType);
      }
    }
  }

  const inProgress = await isEricaRequestInProgress(userData);

  return {
    error: false,
    showSpinner: inProgress,
  };
};

const validateInputSteuerId = (steuerId: string) =>
  (validator.isEmpty(steuerId) && "errors.required") ||
  (!validator.isLength(steuerId, { min: 11, max: 11 }) &&
    "errors.steuerId.wrongLength") ||
  (!validator.isInt(steuerId) && "errors.steuerId.onlyNumbers") ||
  (!validator.isTaxID(steuerId, "de-DE") && "errors.steuerId.invalid");

const validateInputGeburtsdatum = (geburtsdatum: string) =>
  (validator.isEmpty(geburtsdatum) && "errors.required") ||
  (!validator.isDate(geburtsdatum, {
    format: "DD.MM.YYYY",
    delimiters: ["."],
  }) &&
    "errors.geburtsdatum.wrongFormat");

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

  const ericaRequestIsInProgress = await isEricaRequestInProgress(userData);

  if (ericaRequestIsInProgress) {
    return {};
  }

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
    steuerId: validateInputSteuerId(normalizedSteuerId),
    geburtsdatum: validateInputGeburtsdatum(normalizedGeburtsdatum),
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
  const { t } = useTranslation("all");
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/fsc/beantragen?index");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContentContainer size="sm">
      <Headline>Beantragen Sie Ihren persönlichen Freischaltcode.</Headline>

      <IntroText>
        Nur mit einem Freischaltcode können Sie Ihre Grundsteuererklärung nach
        Eingabe aller Daten absenden. Mit Eingabe des Codes bestätigen Sie Ihre
        Identität, das heißt: Wir wissen, dass keine andere Person
        widerrechtlich die Grundsteuererklärung abgibt.
      </IntroText>

      {loaderData?.error && (
        <div className="p-16 mb-32 bg-red-200 border-2 border-red-800">
          Es ist ein Fehler aufgetreten.
        </div>
      )}

      <Form method="post">
        <FormGroup>
          <Input
            name="steuerId"
            label="Steuer-Identifikationsnummer"
            error={t(errors?.steuerId)}
          />
        </FormGroup>
        <FormGroup isLast>
          <Input
            name="geburtsdatum"
            label="Geburtsdatum"
            placeholder="TT.MM.JJJJ"
            error={t(errors?.geburtsdatum)}
            className="w-1/2"
          />
        </FormGroup>
        <div className="flex flex-row-reverse justify-between items-center">
          <Button>Freischaltcode beantragen</Button>
          <Button look="secondary" to="/formular/welcome">
            Später beantragen
          </Button>
        </div>
      </Form>
    </ContentContainer>
  );
}
