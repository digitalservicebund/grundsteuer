import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Headline,
  Input,
  Spinner,
} from "~/components";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getErrorMessageForFreischaltcode } from "~/domain/validation";
import { removeUndefined } from "~/util/removeUndefined";
import {
  activateFreischaltCode,
  checkFreischaltcodeActivation,
} from "~/erica/freischaltCodeAktivieren";
import {
  deleteEricaRequestIdFscAktivieren,
  findUserByEmail,
  saveEricaRequestIdFscAktivieren,
  setUserIdentified,
  User,
} from "~/domain/user";
import { authenticator } from "~/auth.server";
import { useEffect } from "react";

const isEricaRequestInProgress = async (userData: User) => {
  return Boolean(userData.ericaRequestIdFscAktivieren);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return userData.identified;
};

const getEricaRequestIdFscAktivieren = async (userData: User) => {
  invariant(
    userData.ericaRequestIdFscAktivieren,
    "ericaRequestIdFscAktivieren is null"
  );
  return userData.ericaRequestIdFscAktivieren;
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
    return redirect("/fsc/eingeben/erfolgreich");
  }

  if (await isEricaRequestInProgress(userData)) {
    const elsterRequestIdOrError = await checkFreischaltcodeActivation(
      await getEricaRequestIdFscAktivieren(userData)
    );
    if (elsterRequestIdOrError) {
      if (typeof elsterRequestIdOrError == "boolean") {
        await setUserIdentified(user.email, true);
        await deleteEricaRequestIdFscAktivieren(user.email);
      } else if (elsterRequestIdOrError?.errorType == "EricaUserInputError") {
        await deleteEricaRequestIdFscAktivieren(user.email);
        return {
          error: true,
          showSpinner: false,
        };
      } else {
        await deleteEricaRequestIdFscAktivieren(user.email);
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

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );
  invariant(
    userData.fscRequest.length >= 1,
    "expected an fscRequest in database for user"
  );
  const elsterRequestId = userData.fscRequest[0].requestId;

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  const ericaRequestIsInProgress = await isEricaRequestInProgress(userData);

  if (ericaRequestIsInProgress) {
    return {};
  }

  const formData = await request.formData();
  const freischaltCode = formData.get("freischaltCode");

  invariant(
    typeof freischaltCode === "string",
    "expected formData to include freischaltCode field of type string"
  );

  const normalizedFreischaltCode = freischaltCode.replace(/[\s/]/g, "");

  const errors = {
    freischaltCode: await getErrorMessageForFreischaltcode(
      normalizedFreischaltCode
    ),
  };

  const errorsExist = errors.freischaltCode;

  if (errorsExist) {
    return json({
      errors: removeUndefined(errors),
    });
  }

  const ericaRequestId = await activateFreischaltCode(
    normalizedFreischaltCode,
    elsterRequestId
  );
  await saveEricaRequestIdFscAktivieren(user.email, ericaRequestId);

  return {};
};

export default function FscEingeben() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/fsc/eingeben?index");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
      <ContentContainer size="sm">
        <Headline>Bitte geben Sie Ihren Freischaltcode ein</Headline>

        {loaderData?.error && (
            <div className="p-16 mb-32 bg-red-200 border-2 border-red-800">
              Es ist ein Fehler aufgetreten.
            </div>
        )}

        <Form method="post">
          <div>
            <FormGroup>
              <Input
                  name="freischaltCode"
                  label="Freischaltcode"
                  error={errors?.freischaltCode}
              />
            </FormGroup>
          </div>
          <ButtonContainer forceMultiline>
            <Button>Freischaltcode speichern</Button>
            <Button look="secondary" to="/formular/welcome">
              Zurück
            </Button>
          </ButtonContainer>
        </Form>
        <a href={"/fsc/neuBeantragen"}>
          Zwei Wochen sind um und Sie haben noch keinen Brief mit dem
          Freischaltcode erhalten?
        </a>
        {loaderData?.showSpinner && (
            <Spinner
                initialText={"Ihr Freischaltcode wird überprüft."}
                waitingText={
                  "Das Überprüfen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
                }
                longerWaitingText={
                  "Wir überprüfen weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
                }
            />
        )}
      </ContentContainer>
  );
}
