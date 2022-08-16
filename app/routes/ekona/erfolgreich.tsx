import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";
import IdentificationSuccess from "~/components/IdentificationSuccess";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!sessionUser.identified) {
    const dbUser = await findUserByEmail(sessionUser.email);
    invariant(
      dbUser,
      "expected a matching user in the database from a user in a cookie session"
    );
    if (!dbUser.identified) {
      return redirect("/identifikation");
    }
    const session = await getSession(request.headers.get("Cookie"));
    session.set(
      "user",
      Object.assign(session.get("user"), { identified: true })
    );

    return json(
      {},
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
  return {};
};

export default function EkonaErfolgreich() {
  return <IdentificationSuccess backButton="start" />;
}
