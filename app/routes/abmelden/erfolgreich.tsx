import { MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Abmelden erfolgreich") };
};

export default function AbmeldenErfolgreich() {
  return (
    <UserLayout>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>Sie haben sich erfolgreich abgemeldet.</Headline>

        <IntroText className="mb-80">
          Ihre Daten sind gespeichert.
          <br />
          Bitte melden Sie sich nächstes Mal wieder von diesem Gerät und Browser
          an, um zum aktuellen Stand zurückzukehren.
        </IntroText>

        <Button to="/">Zur Startseite</Button>
      </ContentContainer>
    </UserLayout>
  );
}
