import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { findUserByEmail } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

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
  return {};
};

export default function BundesIdentErfolgreich() {
  return (
    <>
      <IdentificationSuccess backButton="start">
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
          </a>
          schreiben.
        </div>
      </IdentificationSuccess>
    </>
  );
}
