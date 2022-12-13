import { LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { findUserByEmail } from "~/domain/user";
import { authenticator } from "~/auth.server";
import { hasValidOpenFscRequest } from "~/domain/identificationStatus";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const dbUser = await findUserByEmail(sessionUser.email);
  invariant(
    dbUser,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (hasValidOpenFscRequest(dbUser)) {
    return redirect("/fsc/eingeben");
  }
  return redirect("/fsc/beantragen");
};

export default function FscIndex() {
  return null;
}
