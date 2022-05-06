import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { findUserByEmail, User } from "~/domain/user";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);

  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );
  invariant(userData.pdf, "expected pdf to be stored in user");

  const response = new Response(userData.pdf);
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="Grundsteuererklaerung.pdf"`
  );
  response.headers.set("Content-Type", "application/pdf");
  return response;
};
