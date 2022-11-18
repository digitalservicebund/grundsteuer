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

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich storniert") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {};
};

export default function FscStornierenErfolgreich() {
  return (
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <SuccessPageLayout>
        <Headline>Freischaltcode erfolgreich storniert</Headline>

        <IntroText>
          Bitte beachten Sie, dass Ihnen der stornierte Freischaltcode trotzdem
          noch per Post zugestellt werden kann, wenn sich dieser bereits in der
          Zusendung befand. Dieser ist allerdings ungültig und kann nicht
          verwendet werden.
        </IntroText>

        <IntroText className="mb-64">
          Bitte warten Sie, bis Ihnen der neue Freischaltcode zugestellt wird.
          Prüfen Sie dafür auch das Antragsdatum.
        </IntroText>

        <Button to="/fsc/beantragen">Freischaltcode neu beantragen</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
