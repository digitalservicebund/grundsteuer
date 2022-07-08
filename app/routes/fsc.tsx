import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { UserLayout } from "~/components";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (
    sessionUser.identified &&
    !request.url.includes("fsc/eingeben/erfolgreich")
  ) {
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
