import { MetaFunction } from "@remix-run/node";
import { Button, SimplePageLayout } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich") };
};

export default function RegistrierenErfolgreich() {
  return (
    <SimplePageLayout>
      <h1 className="text-32 mb-32">Vielen Dank!</h1>

      <p className="mb-32">Sie haben ein Konto erstellt.</p>

      <Button to="/anmelden?registered=1">Weiter zum Anmelden</Button>
    </SimplePageLayout>
  );
}
