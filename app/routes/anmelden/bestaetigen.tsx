import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/fsc",
    failureRedirect: "/anmelden",
  });
};
