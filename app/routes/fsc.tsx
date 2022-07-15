import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
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
  } else if (
    request.url.includes("fsc/neuBeantragen") &&
    !testFeaturesEnabled
  ) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return {};
};

export default function Fsc() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}
