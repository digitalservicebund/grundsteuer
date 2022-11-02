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
  return { email: sessionUser.email, flags: flags.getAllFlags() };
};

export default function Ekona() {
  const { email, flags } = useLoaderData();
  const location = useLocation();
  return (
    <UserLayout email={email} flags={flags} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
