import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import IdentificationSuccess from "~/components/IdentificationSuccess";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich identifiziert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  return {};
};

export default function IdentifikationErfolgreich() {
  return <IdentificationSuccess backButton="start" />;
}
