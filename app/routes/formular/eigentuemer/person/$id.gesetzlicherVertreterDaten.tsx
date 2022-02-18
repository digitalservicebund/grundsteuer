import { useActionData } from "remix";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "./../../_step";

const headline = "Gesetzlicher Vertreter Daten";

export default function GesetzlicherVertreterDaten() {
  const actionData = useActionData();

  return render(
    actionData,
    headline,
    <>
      <p>Daten</p>
    </>
  );
}
