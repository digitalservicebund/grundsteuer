import { useEffect } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  Session,
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

const isEricaRequestInProgress = (session: Session) => {
  return truthy(session.get("ericaRequestId"));
};

const wasEricaRequestSuccessful = (session: Session) => {
  return truthy(session.get("elsterRequestId"));
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  let error = false;

  if (wasEricaRequestSuccessful(session)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (isEricaRequestInProgress(session)) {
    try {
      const elsterRequestId = await retrieveAntragsId(
        session.get("ericaRequestId")
      );
      if (elsterRequestId) {
        session.set("elsterRequestId", elsterRequestId);
        session.unset("ericaRequestId");
      }
    } catch (Error) {
      session.unset("ericaRequestId");
      error = true;
    }
  }

  return json(
    {
      inProgress: truthy(session.get("ericaRequestId")),
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
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));

  if (wasEricaRequestSuccessful(session)) {
    return redirect("/fsc/beantragen/erfolgreich");
  }

  if (!isEricaRequestInProgress(session)) {
    const formData = await request.formData();
    const steuerId = formData.get("steuerId");
    const geburtsdatum = formData.get("geburtsdatum");

    if (steuerId && geburtsdatum) {
      const ericaRequestId = await requestNewFreischaltCode(
        steuerId.toString(),
        geburtsdatum?.toString()
      );
      session.set("ericaRequestId", ericaRequestId);
    }
  }
  return json(
    {
      inProgress: truthy(session.get("ericaRequestId")),
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
