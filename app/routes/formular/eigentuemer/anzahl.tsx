import { useActionData, useLoaderData } from "remix";
import { StepTextField } from "~/components";
import { render } from "~/routes/formular/_step";
import { eigentuemerAnzahlField } from "~/domain/fields/eigentuemer/anzahl";

export { action, loader, handle } from "./../_step";

export default function Anzahl() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const field = eigentuemerAnzahlField;
  field.label = i18n[field.name];

  return render(
    actionData,
    i18n.headline,
    <>
      <StepTextField config={field} value={formData?.[field.name]} />
    </>
  );
}
