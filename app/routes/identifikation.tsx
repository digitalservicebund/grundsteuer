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
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {
    flags: flags.getAllFlags(),
    useUseId: process.env.USE_USEID === "true",
  };
};

export default function Identifikation() {
  const { flags, useUseId } = useLoaderData();
  const location = useLocation();
  return (
    <UserLayout flags={flags} path={location.pathname} useUseid={useUseId}>
      <Outlet />
    </UserLayout>
  );
}
