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

  if (!userData.transferticket) {
    throw new Response("Not found", { status: 404 });
  }

  const response = new Response(userData.transferticket);
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="TransferticketGrundsteuererklaerung.txt"`
  );
  response.headers.set("Content-Type", "application/txt");
  return response;
};
