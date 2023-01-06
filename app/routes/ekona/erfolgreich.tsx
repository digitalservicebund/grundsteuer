import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";
import { findUserByEmail } from "~/domain/user";
import IdentificationSuccess from "~/components/IdentificationSuccess";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!sessionUser.identified) {
    const dbUser = await findUserByEmail(sessionUser.email);
    if (!dbUser) return logoutDeletedUser(request);

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
