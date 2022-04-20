import { MetaFunction } from "@remix-run/node";
import { Button, SimplePageLayout } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Abmelden erfolgreich") };
};

export default function AbmeldenErfolgreich() {
  return (
    <SimplePageLayout>
      <h1 className="text-32">Sie haben sich erfolgreich abgemeldet.</h1>

      <p className="mb-64">
        Ihre Daten sind gespeichert.
        <br />
        Bitte melden Sie sich nächstes Mal wieder von diesem Gerät und Browser
        an, um zum aktuellen Stand zurückzukehren.
      </p>

      <Button to="/" className="mr-32">
        Zur Startseite
      </Button>
    </SimplePageLayout>
  );
}
