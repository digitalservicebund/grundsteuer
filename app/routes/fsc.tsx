import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {};
};

export default function Fsc() {
  return <Outlet />;
}
