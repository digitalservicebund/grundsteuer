import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";

export const loader: LoaderFunction = async ({ request }) => {
  if (flags.isBundesIdentDisabled()) {
    throw new Response("Not Found", {
      status: 404,
    });
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
    isMobile: isMobileUserAgent(request),
  };
};

export default function BundesIdent() {
  const { email, flags, isMobile } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout
      email={email}
      flags={flags}
      path={location.pathname}
      isMobile={isMobile}
    >
      <Outlet />
    </UserLayout>
  );
}
