import { LoaderFunction, MetaFunction, redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { commitSession, getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  if (!dbUser.identified) {
    return redirect("/identifikation");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const hasSurveyShown = Boolean(session.get("hasSurveyShown"));
  session.set("hasSurveyShown", hasSurveyShown);

  return { hasSurveyShown };
};

export default function BundesIdentErfolgreich() {
  const { hasSurveyShown } = useLoaderData();

  return (
    <>
      <IdentificationSuccess
        backButton="start"
        identificationType="bundesIdent"
        hasSurveyShown={hasSurveyShown}
      >
        <div className="mt-48 text-18 leading-26">
          <h2 className="font-bold mb-8">
            Haben Sie Feedback oder Fragen zur BundesIdent App?
          </h2>
          Ihr Feedback hilft uns, die App zu verbessern! Wir freuen uns, wenn
          Sie uns an{" "}
          <a
            href="mailto:hilfe@bundesident.de"
            className="font-bold text-blue-800 underline"
          >
            hilfe@bundesident.de
          </a>{" "}
          schreiben.
        </div>
      </IdentificationSuccess>
    </>
  );
}
