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
  FormGroup,
  Input,
  SimplePageLayout,
  Spinner,
} from "~/components";
import {
  requestNewFreischaltCode,
  retrieveAntragsId,
} from "~/erica/freischaltCode";

import { commitSession, getSession } from "~/session.server";
import is from "@sindresorhus/is";
import truthy = is.truthy;
import {
  deleteEricaRequestIdFscBeantragen,
  findUserByEmail,
  saveEricaRequestIdFscBeantragen,
  saveFscRequest,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";

const isEricaRequestInProgress = async (userData: User) => {
  return truthy(userData.ericaRequestIdFscBeantragen);
};

const wasEricaRequestSuccessful = async (userData: User) => {
  return truthy(userData.fscRequest.length > 0);
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

  const session = await getSession(request.headers.get("Cookie"));

  let error = false;

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (await isEricaRequestInProgress(userData)) {
    try {
      const elsterRequestId = await retrieveAntragsId(
        await getEricaRequestIdFscBeantragen(userData)
      );
      if (elsterRequestId) {
        await saveFscRequest(user.email, elsterRequestId);
        await deleteEricaRequestIdFscBeantragen(user.email);
      }
    } catch (Error) {
      await deleteEricaRequestIdFscBeantragen(user.email);
      error = true;
    }
  }

  return json(
    {
      inProgress: await isEricaRequestInProgress(userData),
      error,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
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

  const session = await getSession(request.headers.get("Cookie"));

  if (await wasEricaRequestSuccessful(userData)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (!(await isEricaRequestInProgress(userData))) {
    const formData = await request.formData();
    const steuerId = formData.get("steuerId");
    const geburtsdatum = formData.get("geburtsdatum");

    if (steuerId && geburtsdatum) {
      const ericaRequestId = await requestNewFreischaltCode(
        steuerId.toString(),
        geburtsdatum?.toString()
      );

      await saveEricaRequestIdFscBeantragen(user.email, ericaRequestId);
    }
  }
  return json(
    {
      inProgress: await isEricaRequestInProgress(userData),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Redirect() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetcher.load("/fsc/beantragen?index");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const spinnerElement =
    (actionData?.inProgress || loaderData?.inProgress) && !loaderData?.error ? (
      <Spinner />
    ) : null;

  return (
    <SimplePageLayout>
      {spinnerElement}
      <pre>{JSON.stringify({ loaderData }, null, 2)}</pre>
      <pre>{JSON.stringify({ actionData }, null, 2)}</pre>
      <br />
      <h1 className="text-32 mb-32">
        Beantragen Sie Ihren persönlichen Freischaltcode.
      </h1>

      {loaderData?.error && (
        <div className="bg-red-200 border-2 border-red-800 p-16 mb-32">
          Es ist ein Fehler aufgetreten.
        </div>
      )}

      <Form method="post">
        <FormGroup>
          <Input
            name="steuerId"
            label="Steuer-Identifikationsnummer"
            help="Ihre Steuer-Identifikationsnummer finden Sie auf Ihren Steuerbescheiden, Lohnsteuerabrechnungen oder anderen Unterlagen, die Sie von Ihrem Finanzamt erhalten haben. Die Steuer-ID ist elfstellig."
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="geburtsdatum"
            label="Geburtsdatum"
            placeholder="TT.MM.JJJJ"
            error={actionData?.errors?.geburtsdatum}
          />
        </FormGroup>
        <Button>Freischaltcode beantragen</Button>
      </Form>
    </SimplePageLayout>
  );
}
