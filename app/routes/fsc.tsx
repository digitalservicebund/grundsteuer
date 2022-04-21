import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (user.identified) {
    return redirect("/formular/welcome");
  }

  return {};
};

export default function Fsc() {
  return <Outlet />;
}
