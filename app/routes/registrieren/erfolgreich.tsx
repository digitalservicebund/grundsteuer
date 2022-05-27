import { MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
  SuccessPageLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich") };
};

export default function RegistrierenErfolgreich() {
  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <SuccessPageLayout>
          <Headline>Konto erfolgreich erstellt.</Headline>
          <IntroText className="!mb-80">
            Sie haben erfolgreich ein Konto erstellt. Merken Sie sich ihre
            Anmeldedaten – aktuell können Sie ihr Passwort nocht nicht
            zurücksetzen.
          </IntroText>

          <Button to="/anmelden?registered=1">Zur Anmeldung</Button>
        </SuccessPageLayout>
      </ContentContainer>
    </UserLayout>
  );
}
