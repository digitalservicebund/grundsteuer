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
  return { ericaDown: flags.isEricaDown(), ekonaDown: flags.isEkonaDown() };
};

export default function Identifikation() {
  const { ekonaDown, ericaDown } = useLoaderData();
  const banners = { ericaDown, ekonaDown };
  const location = useLocation();
  return (
    <UserLayout banners={banners} path={location.pathname}>
      <Outlet />
    </UserLayout>
  );
}
