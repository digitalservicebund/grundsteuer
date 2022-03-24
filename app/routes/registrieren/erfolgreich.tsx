import { MetaFunction } from "remix";
import { Button } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich") };
};

export default function RegistrierenErfolgreich() {
  return (
    <div>
      <h1 className="text-32">Vielen Dank!</h1>

      <p className="mb-24">Sie haben ein Konto erstellt.</p>

      <Button to="/formular">Weiter zum Formular</Button>
    </div>
  );
}
