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

  return { ericaDown: flags.isEricaDown() };
};

export default function Fsc() {
  const { ericaDown } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout banners={{ ericaDown: ericaDown }} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
