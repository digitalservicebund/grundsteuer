import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { UserLayout } from "~/components";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (
    sessionUser.identified &&
    !request.url.includes("fsc/eingeben/erfolgreich")
  ) {
    return redirect("/formular");
  }

  return { email: sessionUser.email, flags: flags.getAllFlags() };
};

export default function Fsc() {
  const { email, flags } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout email={email} flags={flags} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
