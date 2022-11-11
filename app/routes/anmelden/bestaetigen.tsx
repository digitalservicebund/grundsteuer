import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { throwErrorIfRateLimitReached } from "~/redis/rateLimiting.server";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { clientIp } = context;
  await throwErrorIfRateLimitReached(clientIp, "anmelden", 20);
  await authenticator.authenticate("email-link", request, {
    successRedirect: "/anmelden/erfolgreich",
    failureRedirect: "/anmelden?error=token",
  });
};
