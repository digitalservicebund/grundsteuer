import { json, LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { createHeadersWithFormDataCookie } from "~/formDataStorage.server";
import { grundModelFactory } from "~/factories";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (process.env.APP_ENV === "production") return redirect("/invalid");

  const dataToBeStored = grundModelFactory.full().build();
  const headers = await createHeadersWithFormDataCookie({
    data: dataToBeStored,
    user,
  });
  return json({}, { headers });
};

export default function Full() {
  return <div>Daten aktualisiert.</div>;
}
