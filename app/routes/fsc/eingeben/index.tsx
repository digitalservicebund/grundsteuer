import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Button,
  ButtonContainer,
  BreadcrumbNavigation,
  ContentContainer,
  FormGroup,
  Headline,
  Spinner,
} from "~/components";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
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
import { useEffect, useState } from "react";
import FreischaltCodeInput from "~/components/FreischaltCodeInput";

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

  const ericaRequestIsInProgress = await isEricaRequestInProgress(userData);

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/eingeben/erfolgreich");
  }

  if (ericaRequestIsInProgress) {
    const fscActivatedOrError = await checkFreischaltcodeActivation(
      await getEricaRequestIdFscAktivieren(userData)
    );
    if (fscActivatedOrError) {
      if (typeof fscActivatedOrError == "boolean") {
        await setUserIdentified(user.email, true);
        await deleteEricaRequestIdFscAktivieren(user.email);
      } else if (fscActivatedOrError?.errorType == "EricaUserInputError") {
        await deleteEricaRequestIdFscAktivieren(user.email);
        return {
          showError: true,
          showSpinner: false,
        };
      } else {
        await deleteEricaRequestIdFscAktivieren(user.email);
        throw new Error(fscActivatedOrError?.errorType);
      }
    }
  }

  return {
    showError: false,
    showSpinner: ericaRequestIsInProgress,
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

  if (await isEricaRequestInProgress(userData)) return {};

  const formData = await request.formData();
  const freischaltCode = formData.get("freischaltCode");

  invariant(
    typeof freischaltCode === "string",
    "expected formData to include freischaltCode field of type string"
  );

  const errors = {
    freischaltCode: await getErrorMessageForFreischaltcode(freischaltCode),
  };

  const errorsExist = errors.freischaltCode;

  if (errorsExist) {
    return json({
      errors: removeUndefined(errors),
    });
  }

  const ericaRequestId = await activateFreischaltCode(
    freischaltCode,
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
        fetcher.load("/fsc/eingeben?index");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <Headline>Bitte geben Sie Ihren Freischaltcode ein</Headline>

      {showError && (
        <div className="p-16 mb-32 bg-red-200 border-2 border-red-800">
          Mit diesen Daten können wir den FSC nicht aktivieren.
        </div>
      )}

      <Form method="post">
        <div>
          <FormGroup>
            <FreischaltCodeInput
              name="freischaltCode"
              label="Freischaltcode"
              error={errors?.freischaltCode}
            />
          </FormGroup>
        </div>
        <ButtonContainer forceMultiline>
          <Button disabled={isSubmitting || showSpinner}>
            Freischaltcode speichern
          </Button>
          <Button look="secondary" to="/formular/welcome">
            Zurück
          </Button>
        </ButtonContainer>
      </Form>
      <a href={"/fsc/neuBeantragen"}>
        Zwei Wochen sind um und Sie haben noch keinen Brief mit dem
        Freischaltcode erhalten?
      </a>
      {showSpinner && (
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
