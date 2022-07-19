import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { UserLayout } from "~/components";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

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

  return { showNewIdent: testFeaturesEnabled };
};

export default function Fsc() {
  const { showNewIdent } = useLoaderData();
  return (
    <UserLayout showNewIdent={showNewIdent}>
      <Outlet />
    </UserLayout>
  );
}
