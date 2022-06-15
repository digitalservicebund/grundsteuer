import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  console.log({ request });
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/fsc",
    failureRedirect: "/anmelden?error=token",
  });
};
