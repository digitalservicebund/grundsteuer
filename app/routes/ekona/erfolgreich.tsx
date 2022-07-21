import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { ContentContainer } from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich eingegeben") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return null;
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="sm">
      Wir konnten Sie anhand Ihrer ELSTER Zugangsdaten erfolgreich
      identifizieren. Sie können die Erklärung nun nach vollständiger
      Bearbeitung absenden.
    </ContentContainer>
  );
}
