import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { UserLayout } from "~/components";
import { findUserByEmail } from "~/domain/user";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const user = await findUserByEmail(sessionUser.email);
  invariant(
    user,
    "expected a matching user in the database from a user in a cookie session"
  );

  if (!user.inDeclarationProcess) {
    return redirect("/formular/erfolg");
  }
  if (user.identified && !request.url.includes("fsc/eingeben/erfolgreich")) {
    return redirect("/formular/welcome");
  }

  return {};
};

export default function Fsc() {
  return (
    <UserLayout userIsLoggedIn={true}>
      <Outlet />
    </UserLayout>
  );
}
