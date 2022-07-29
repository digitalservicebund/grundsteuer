import { Outlet } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  if (sessionUser.identified && request.url.includes("/ekona/callback")) {
    return redirect("/ekona/erfolgreich");
  }

  return {};
};

export default function Ekona() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}
