import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  if (process.env.USE_USE_ID !== "true") {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );
  if (!dbUser.identified) {
    return redirect("/identifikation");
  }
  return {};
};

export default function BundesIdentErfolgreich() {
  return <IdentificationSuccess backButton="start" />;
}
