import { LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Feature, redis } from "~/redis.server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loader: LoaderFunction = async ({ params }) => {
  const { origin, email } = params;

  invariant(
    typeof origin === "string",
    "Expected 'origin' to be included in params."
  );
  invariant(
    typeof email === "string",
    "Expected 'email' to be included in params."
  );
  invariant(
    ["registrieren", "anmelden"].includes(origin),
    "Expected origin to be 'registrieren' or 'anmelden'."
  );

  console.log({ origin, email });

  await delay(1000); // :/
  const messageId = await redis.get(Feature.MESSAGE_ID, email);
  console.log({ messageId });

  return redirect(`/email/status/${origin}/${email}/${messageId}`);
};

export default function EmailDispatcher() {
  return null;
}
