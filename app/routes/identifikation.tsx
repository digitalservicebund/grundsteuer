import { UserLayout } from "~/components";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {
    email: sessionUser.email,
    flags: flags.getAllFlags(),
  };
};

export default function Identifikation() {
  const { email, flags } = useLoaderData();
  const location = useLocation();
  return (
    <UserLayout email={email} flags={flags} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
