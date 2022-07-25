import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { createSamlRequest } from "~/ekona/saml.server";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import EnumeratedCard from "~/components/EnumeratedCard";
import ekona1 from "~/assets/images/ekona-1.png";
import ekona2 from "~/assets/images/ekona-2.svg";
import ekona3 from "~/assets/images/ekona-3.svg";
import {
  commitEkonaSession,
  getEkonaSession,
} from "~/ekona/ekonaCookies.server";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit Elster") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const session = await getEkonaSession(request.headers.get("Cookie"));
  const saml = await createSamlRequest(session);
  session.set("userId", user.id);

  return json(
    {
      context: saml,
    },
    {
      headers: {
        "Set-Cookie": await commitEkonaSession(session),
      },
    }
  );
};

export default function EkonaIndex() {
  const { context } = useLoaderData();
  return (
    <>
      <ContentContainer size="sm" className="mb-80">
        <BreadcrumbNavigation />
        <Headline>Identifizieren Sie sich mit Ihrem ELSTER-Konto</Headline>
        <IntroText>
          Sie können Ihre ELSTER Zugangsdaten nutzen, um sich für diesen
          Online-Dienst eindeutig und sicher zu identifizieren. Nach der
          erfolgreichen Anmeldung werden Sie zurück zu unserem Online-Dienst
          geleitet und können Ihre Erklärung an das Finanzamt übermitteln.
        </IntroText>
        <form method="post" action="https://e4k-portal.een.elster.de/ekona/sso">
          <input type="hidden" name="SAMLRequest" value={context} />
          <ButtonContainer>
            <Button data-testid="submit" type="submit">
              Zur Identifikation mit ELSTER-Konto
            </Button>
            <Button look="secondary" to="/identifikation">
              Zurück zur Übersicht
            </Button>
          </ButtonContainer>
        </form>
      </ContentContainer>

      <ContentContainer size="lg">
        <h2 className="mb-32 text-24">Wie melde ich mich an?</h2>
        <div className="mb-80">
          <EnumeratedCard
            image={ekona1}
            imageAltText="Bildbeispiel der Oberfläche für ELSTER Zugang"
            number="1"
            heading="Link öffnen"
            text="Klicken Sie auf die blaue Schaltfläche “Zur Identifikation mit ELSTER-Konto”. Es öffnet sich eine neue Seite. Wählen Sie unter den Optionen Ihre ELSTER Anmeldevariante aus: Elsterzertifikat, Personalausweis, Mobiles Login, Sicherheitsstick oder Signaturkarte."
            className="mb-16"
          />
          <EnumeratedCard
            image={ekona2}
            imageAltText="Illustration Bestätigung der Datenweitergabe"
            number="2"
            heading="Bestätigung der Datenweitergabe"
            text="Folgen Sie den Anweisungen der Seite und bestätigen Sie nach erfolgreicher Anmeldung, dass die Daten an unseren Service übermittelt werden dürfen. Danach werden Sie zurück zu unserem Online-Dienst geleitet."
            className="mb-16"
          />
          <EnumeratedCard
            image={ekona3}
            imageAltText="Illustration Identifikation erfolgreich"
            number="3"
            heading="Identifikation erfolgreich"
            text="Sie sind nun identifiziert und können mit der Grundsteuererklärung starten. Nach vollständiger Bearbeitung, kann die Erklärung abgegeben werden.  "
            className="mb-16"
          />
        </div>
      </ContentContainer>
    </>
  );
}
