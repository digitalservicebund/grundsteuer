import { ActionFunction } from "remix";
import { authenticator } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/abmelden/erfolgreich" });
};

export default function Abmelden() {
  return null;
}
