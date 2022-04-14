import { MetaFunction } from "remix";
import { pageTitle } from "~/util/pageTitle";
import { SimplePageLayout } from "~/components";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Erklärung abgeschickt") };
};

export default function Erfolg() {
  return <SimplePageLayout>Erfolgreich abgesendet</SimplePageLayout>;
}
