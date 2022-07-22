import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { ContentContainer } from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return null;
};

export default function EkonaErfolgreich() {
  return (
    <ContentContainer size="sm">
      Wir konnten Sie anhand Ihrer ELSTER Zugangsdaten erfolgreich
      identifizieren. Sie können die Erklärung nun nach vollständiger
      Bearbeitung absenden.
    </ContentContainer>
  );
}
