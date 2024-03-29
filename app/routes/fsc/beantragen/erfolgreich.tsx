import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import EnumeratedList from "~/components/EnumeratedList";
import letter from "~/assets/images/fsc-letter-eingeben.png";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {};
};

export default function FscBeantragenErfolgreich() {
  return (
    <ContentContainer size="lg">
      <BreadcrumbNavigation />
      <Headline>Vielen Dank</Headline>

      <ContentContainer size="sm-md" className="mb-32">
        <IntroText>
          Sie haben Ihren persönlichen Freischaltcode beantragt. Diesen erhalten
          sie voraussichtlich in den nächsten 3 Wochen per Post. Sie können
          jetzt die Grundsteuererklärung ausfüllen und nach Erhalt des Briefes
          den Freischaltcode eingeben.
        </IntroText>
      </ContentContainer>

      <ContentContainer
        size="md"
        className="bg-white pt-32 pr-80 pb-64 pl-32 mb-64"
      >
        <ContentContainer size="sm">
          <h2 className="text-24 mb-16">Wie geht es jetzt weiter?</h2>
          <EnumeratedList
            items={[
              "Sie haben Ihren Freischaltcode erfolgreich beantragt. Bitte warten Sie, bis Ihnen dieser an Ihre Meldeadresse zugesendet wird.",
              "Der Versand wird ungefähr 3 Wochen dauern.",
              "Den 12-stelligen Freischaltcode finden Sie auf der letzten Seite des Briefes unter der Zeile “Antragsteller:in Digitalservice GmbH des Bundes”. Senden Sie uns den Brief nicht zu.",
            ]}
            className="mb-32"
          />
          <img
            src={letter}
            alt="Bildbeispiel des Freischaltcode Brief"
            className="ml-40"
          />
        </ContentContainer>
      </ContentContainer>

      <Button to="/formular">Weiter zum Formular</Button>
    </ContentContainer>
  );
}
