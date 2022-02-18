import { useActionData, useLoaderData } from "remix";
import { render } from "~/routes/formular/_step";
import Address from "~/components/Address";
import { vertreterAdresseFields } from "~/domain/fields/eigentuemer/person/vertreter/adresse";

export { action, loader, handle } from "~/routes/formular/_step";

export default function VertreterAdresse() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const fields = vertreterAdresseFields;

  fields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,

    <Address fields={fields} formData={formData} />
  );
}
