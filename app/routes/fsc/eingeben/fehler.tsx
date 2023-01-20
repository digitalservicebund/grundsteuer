import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import LinkWithArrow from "~/components/LinkWithArrow";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle("Es gab ein technisches Problem mit Ihrem Freischaltcode"),
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  return {};
};

export default function FscBeantragenErfolgreich() {
  return (
    <>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
        <ContentContainer size="sm" className="mb-48">
          <Headline>
            Es gab ein technisches Problem mit Ihrem Freischaltcode.
          </Headline>
          <IntroText>
            Auf Grund eines technischen Problems zwischen unserem Online-Dienst
            und ELSTER kann Ihr Freischaltcode nicht mehr verwendet werden. Wir
            bedauern dies sehr!
          </IntroText>
        </ContentContainer>

        <h2 className="text-24 mb-24">Das können Sie jetzt tun:</h2>
        <p className="mb-8">
          <strong>Freischaltcode neu beantragen</strong>: Sie können den
          Freischaltcode auch neu beantragen. Sollte dieser nach der Frist
          eintreffen, geben Sie Ihre Erklärung trotzdem schnellstmöglich nach
          Erhalt ab.
        </p>
        <LinkWithArrow href="/fsc/stornieren" className="mb-56">
          Freischaltcode neu beantragen
        </LinkWithArrow>

        <h2 className="text-24 mb-24">Alternativen:</h2>
        <p className="mb-16">
          Wenn Sie eine Alternative zum Freischaltcode verwenden wollen, wählen
          Sie eine andere Identifikationsmethode aus.
        </p>
        <LinkWithArrow href="/identifikation" className="mb-40">
          Zu den Identifikations-Optionen
        </LinkWithArrow>

        <p className="mb-16">
          Klappt keine Identifikation bei Ihnen, dann haben wir folgende
          Alternativen für Sie: Nutzen sie das Konto Ihrer nahen Angehörigen, um
          über diese Ihre Grundsteuererklärung abzugeben oder lesen Sie in
          unserem Hilfebereich weiter, welche Optionen Sie haben.
        </p>
        <LinkWithArrow
          external
          href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/38-abgabe-uber-angehorige-und-bekannte/104-konnen-mich-meine-angehorigen-familie-freunde-nachbarn-bei-der-grundsteuererklarung-unterstutzen"
          className="mb-32"
        >
          Identifikation über nahe Angehörige
        </LinkWithArrow>
        <LinkWithArrow
          external
          href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023/227-welche-alternativen-habe-ich-um-mich-zu-identifizieren"
        >
          Ich kann mich nicht identifizieren
        </LinkWithArrow>
      </ContentContainer>
    </>
  );
}
