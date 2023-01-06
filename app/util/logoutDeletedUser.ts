import { authenticator } from "~/auth.server";

export const logoutDeletedUser = async (request: Request) => {
  return authenticator.logout(request, { redirectTo: "/abmelden/erfolgreich" });
};
