import { useActionData, useLoaderData } from "remix";
import { render } from "~/routes/formular/_step";
import Address from "~/components/Address";
import { personAdresseFields } from "~/domain/fields/eigentuemer/person/adresse";

export { action, loader, handle } from "~/routes/formular/_step";

export default function Adresse() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  personAdresseFields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return render(
    actionData,
    i18n.headline,

    <Address fields={personAdresseFields} formData={formData} />
  );
}
