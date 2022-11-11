import { ActionFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";

export const action: ActionFunction = async ({ request, context }) => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "fsc", 20);
  await authenticator.logout(request, { redirectTo: "/abmelden/erfolgreich" });
};

export default function Abmelden() {
  return null;
}
