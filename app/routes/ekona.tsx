import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (sessionUser.identified && request.url.includes("/ekona/callback")) {
    return redirect("/ekona/erfolgreich");
  }

  if (flags.isEkonaDown()) {
    return { ekonaDown: true };
  }

  return {};
};

export default function Ekona() {
  const { ekonaDown } = useLoaderData();
  const location = useLocation();
  return (
    <UserLayout banners={{ ekonaDown: ekonaDown }} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
