import { useActionData, useLoaderData } from "remix";
import { StepRadioField } from "~/components";
import { render } from "~/routes/formular/_step";
import { verheiratetField } from "~/domain/fields/eigentuemer/verheiratet";

export { action, loader, handle } from "./../_step";

const headline = "Anzahl Eigentümer";

export default function Anzahl() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const field = verheiratetField;
  field.label = i18n.question;
  field.options[0].label = i18n.yes;
  field.options[1].label = i18n.no;

  return render(
    actionData,
    headline,
    <>
      <StepRadioField config={field} value={formData?.[field.name]} />
    </>
  );
}
