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

        <IntroText className="mb-80">
          Ihr vorher beantragter Freischaltcode wurde erfolgreich storniert.
          Bitte beachten Sie, dass es trotzdem passieren kann, dass Ihnen der
          Freischaltcode noch per Post zugestellt wird. Dieser ist dann aber
          ungültig.
        </IntroText>

        <h2 className="mb-32 text-24 font-bold">
          Sie können jetzt einen neuen Freischaltcode beantragen:
        </h2>

        <Button to="/fsc/beantragen">Freischaltcode beantragen</Button>
      </SuccessPageLayout>
    </ContentContainer>
  );
}
