import type { StepComponentFunction } from "~/routes/formular/_step";
import { Name } from "~/components";
import { personNameFields } from "~/domain/fields/eigentuemer/person/name";

const PersonName: StepComponentFunction = ({ formData, i18n }) => {
  const fields = personNameFields;
  fields.forEach((field) => {
    field.label = i18n[field.name];
  });
  return <Name fields={fields} formData={formData} />;
};

export default PersonName;
