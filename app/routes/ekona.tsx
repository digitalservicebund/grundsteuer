import { Outlet } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

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
