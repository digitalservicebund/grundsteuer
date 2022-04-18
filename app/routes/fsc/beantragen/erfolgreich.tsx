import { MetaFunction } from "remix";
import { Button, SimplePageLayout } from "~/components";
import { pageTitle } from "~/util/pageTitle";
import FinishedIcon from "~/components/icons/mui/Finished";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Freischaltcode erfolgreich beantragt") };
};

export default function FscBeantragenErfolgreich() {
  return (
    <SimplePageLayout>
      <FinishedIcon className="w-48 h-48 mb-16" />
      <h1 className="text-32">Vielen Dank!</h1>

      <p className="mb-64">
        Sie haben Ihren persönlichen Freischaltcode beantragt. Diesen erhalten
        Sie in den nächsten 14 Tagen per Post.
      </p>

      <Button to="/formular/welcome">Zurück zum Formular</Button>
    </SimplePageLayout>
  );
}
