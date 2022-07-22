import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { useLoaderData } from "@remix-run/react";
import { getNextStepLink } from "~/util/getNextStepLink";

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
  return {
    nextStepLink: getNextStepLink(request.url),
  };
};

export default function EkonaErfolgreich() {
  const loaderData = useLoaderData();
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Vielen Dank</Headline>

        <IntroText className="mb-80">
          Wir konnten Sie anhand Ihrer ELSTER Zugangsdaten erfolgreich
          identifizieren. Sie können die Erklärung nun nach vollständiger
          Bearbeitung absenden.
        </IntroText>

        <Button to={loaderData.nextStepLink}>Weiter zum Formular</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
