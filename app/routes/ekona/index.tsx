import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { createSamlRequest } from "~/saml.server";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const loader: LoaderFunction = async () => {
  if (!testFeaturesEnabled) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const saml = await createSamlRequest();
  return {
    context: saml,
  };
};

export default function EkonaIndex() {
  const { context } = useLoaderData();
  return (
    <ContentContainer size="sm">
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
          <Button look="secondary" to="/formular/zusammenfassung">
            Zurück zum Formular
          </Button>
        </ButtonContainer>
      </form>
    </ContentContainer>
  );
}
