import { UserLayout } from "~/components";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { flags } from "~/flags.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (flags.isEkonaDown()) {
    return { ekonaDown: true };
  }

  return {};
};

export default function Identifikation() {
  const { ekonaDown } = useLoaderData();
  return (
    <UserLayout banners={ekonaDown ? { ekonaDown: true } : {}}>
      <Outlet />
    </UserLayout>
  );
}
