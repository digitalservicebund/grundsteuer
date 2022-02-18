import { useActionData, useLoaderData } from "remix";
import { StepRadioField } from "~/components";
import { render } from "~/routes/formular/_step";
import { gesVertreterField } from "~/domain/fields/eigentuemer/person/gesetzlicherVertreter";

export { action, loader, handle } from "~/routes/formular/_step";

export default function GesetzlicherVertreter() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const field = gesVertreterField;
  field.label = i18n.question;
  field.options[0].label = i18n.yes;
  field.options[1].label = i18n.no;

  return render(
    actionData,
    i18n.headline,
    <>
      <StepRadioField config={field} value={formData?.[field.name]} />
    </>
  );
}
