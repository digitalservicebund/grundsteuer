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
          jetzt die Feststellungserklärung ausfüllen und zu einem späteren
          Zeitpunkt, nach Erhalt des Briefes, den Freischaltcode eingeben.
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
              "Ihren Freischaltcode haben Sie nun beantragt. Sie warten jetzt, bis dieser per Post bei Ihnen zugestellt wird.",
              "Der Freischaltcode sollte innerhalb von 3 Wochen bei Ihnen zugestellt werden. Durch Weihnachten kann es hier zu Verzögerungen kommen.",
              "Ihr Brief kommt nach spätestens 3 Wochen bei Ihnen an. In dem Brief vom Finanzamt finden Sie auf der letzten Seite den 12-stelligen Freischaltcode. Vermerkt ist in der Zeile darüber “Antragsteller:in Digitalservice GmbH des Bundes”. Das sind wir. Der Brief bleibt bei Ihnen. Senden Sie ihn bitte nicht an uns!",
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
