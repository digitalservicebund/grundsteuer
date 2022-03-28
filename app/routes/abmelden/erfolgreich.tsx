import { MetaFunction } from "remix";
import { Button } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Abmelden erfolgreich") };
};

export default function AbmeldenErfolgreich() {
  return (
    <div>
      <h1 className="text-32">Erfolgreich abgemeldet.</h1>

      <p className="mb-24">Sie können das Fenster jetzt schließen.</p>

      <Button to="/" className="mr-32">
        Zur Startseite
      </Button>

      <Button look="tertiary" to="/anmelden">
        Erneut anmelden
      </Button>
    </div>
  );
}
