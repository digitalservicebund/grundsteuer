import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { UserLayout } from "~/components";
import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  if (process.env.USE_USEID !== "true") {
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
    flags: flags.getAllFlags(),
    useUseid: process.env.USE_USEID === "true",
  };
};

export default function BundesIdent() {
  const { flags, useUseid } = useLoaderData();
  const location = useLocation();

  return (
    <UserLayout flags={flags} path={location.pathname} useUseid={useUseid}>
      <Outlet />
    </UserLayout>
  );
}
