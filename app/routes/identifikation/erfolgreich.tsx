import { LoaderFunction, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { commitSession, getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const session = await getSession(request.headers.get("Cookie"));
  const hasSurveyShown = session.get("hasSurveyShown") || false;
  session.set("hasSurveyShown", hasSurveyShown);

  return json(
    {
      hasSurveyShown,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export default function IdentifikationErfolgreich() {
  const { hasSurveyShown = false } = useLoaderData();
  return (
    <IdentificationSuccess backButton="start" hasSurveyShown={hasSurveyShown} />
  );
}
