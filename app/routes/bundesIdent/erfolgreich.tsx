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
  return <IdentificationSuccess backButton="start" />;
}
