import { useEffect } from "react";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  Session,
  useActionData,
  useFetcher,
  useLoaderData,
} from "remix";
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
      return redirect("/fsc/beantragen/fehler", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
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
        fetcher.load("/fsc/beantragen");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const spinnerElement =
    actionData?.inProgress || loaderData?.inProgress ? <Spinner /> : null;

  return (
    <SimplePageLayout>
      {spinnerElement}
      <pre>{JSON.stringify({ loaderData }, null, 2)}</pre>
      <pre>{JSON.stringify({ actionData }, null, 2)}</pre>
      <br />
      <h1 className="text-32 mb-32">
        Beantragen Sie Ihren persönlichen Freischaltcode.
      </h1>
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
