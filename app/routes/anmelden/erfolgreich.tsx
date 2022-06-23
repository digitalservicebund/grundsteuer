import { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
  Button,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erfolgreich angemeldet.") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  return {};
};
export default function ErfolgreichAngemeldet() {
  return (
    <UserLayout userIsLoggedIn>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout>
          <Headline> Sie haben sich erfolgreich angemeldet. </Headline>
          <IntroText>
            Sie können die Bearbeitung jederzeit unterbrechen und fortführen.
          </IntroText>

          <IntroText className="mb-80">
            Bitte beachten Sie, das dies nur am Gerät und Browser möglich ist,
            in dem Sie sich registriert haben.
          </IntroText>

          <Button to="/fsc">Verstanden & Weiter</Button>
        </SuccessPageLayout>
      </ContentContainer>
    </UserLayout>
  );
}
