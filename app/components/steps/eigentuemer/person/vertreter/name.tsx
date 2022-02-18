import type { StepComponentFunction } from "~/routes/formular/_step";
import { Name } from "~/components";
import { vertreterNameFields } from "~/domain/fields/eigentuemer/person/vertreter/name";

const VertreterName: StepComponentFunction = ({ formData, i18n }) => {
  const fields = vertreterNameFields;
  fields.forEach((field) => {
    field.label = i18n[field.name];
  });
  return <Name fields={fields} formData={formData} />;
};

export default VertreterName;
