import { useActionData, useLoaderData } from "remix";
import { render } from "~/routes/formular/_step";
import Name from "~/components/Name";
import { vertreterNameFields } from "~/domain/fields/eigentuemer/person/vertreter/name";

export { action, loader, handle } from "~/routes/formular/_step";

export default function VertreterName() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const fields = vertreterNameFields;
  fields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,

    <Name fields={fields} formData={formData} />
  );
}
