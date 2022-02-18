import { useActionData, useLoaderData } from "remix";
import { StepTextField } from "~/components";
import { render } from "~/routes/formular/_step";
import { vertreterTelefonnummerField } from "~/domain/fields/eigentuemer/person/vertreter/telefonnummer";

export { action, loader, handle } from "~/routes/formular/_step";

export default function VertreterTelefonnummer() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const field = vertreterTelefonnummerField;
  field.label = i18n[field.name];

  return render(
    actionData,
    i18n.headline,

    <StepTextField config={field} value={formData?.[field.name]} />
  );
}
