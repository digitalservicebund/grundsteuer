import { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";
import { useLoaderData } from "@remix-run/react";
import { PRUEFEN_START_PATH } from "~/routes/__infoLayout/pruefen/_pruefenPath.server";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle("Nachfrage"),
    robots: "noIndex",
  };
};

export const loader: LoaderFunction = async () => {
  return { pruefenPath: PRUEFEN_START_PATH };
};

export default function PruefenNachfrage() {
  const { pruefenPath } = useLoaderData();
  return (
    <ContentContainer>
      <BreadcrumbNavigation />
      <ContentContainer size="sm">
        <Headline className="mb-24">
          Moment — Wollen Sie wirklich ein neues Konto erstellen?
        </Headline>

        <IntroText className="mb-56">
          Wir fragen dies, weil auf diesem Gerät und diesem Browser bereits ein
          Konto erstellt wurde.
        </IntroText>

        <IntroText className="!mb-16">
          Ja, mit der Registrierung eines neuen Kontos fortfahren
        </IntroText>

        <Button to={pruefenPath + "?continue=1"} className="mb-48">
          Neues Konto erstellen
        </Button>

        <IntroText className="!mb-16">
          Nein, ich möchte mich in meinem Nutzerkonto anmelden und meine
          Erklärung weiter bearbeiten.
        </IntroText>

        <Button look="secondary" to="/anmelden" className="mb-160">
          Zur Anmeldung im Nutzerkonto
        </Button>
      </ContentContainer>
    </ContentContainer>
  );
}
