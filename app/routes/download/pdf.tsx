import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { findUserByEmail, User } from "~/domain/user";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  if (!userData) return logoutDeletedUser(request);

  if (!userData.pdf) {
    throw new Response("Not found", { status: 404 });
  }

  const response = new Response(userData.pdf.data);
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="Grundsteuererklaerung.pdf"`
  );
  response.headers.set("Content-Type", "application/pdf");
  return response;
};
