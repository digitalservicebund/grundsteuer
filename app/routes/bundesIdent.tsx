import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  if (flags.isBundesIdentDisabled()) {
    return redirect("/identifikation?direct=true");
  }
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (sessionUser.identified && request.url.includes("/bundesIdent/callback")) {
    return redirect("/bundesIdent/erfolgreich");
  }
  return {
    email: sessionUser.email,
    flags: flags.getAllFlags(),
  };
};

export default function BundesIdent() {
  const { email, flags } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout email={email} flags={flags} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
