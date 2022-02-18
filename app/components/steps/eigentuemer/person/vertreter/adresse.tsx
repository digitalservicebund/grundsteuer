import type { StepComponentFunction } from "~/routes/formular/_step";
import { Address } from "~/components";
import { vertreterAdresseFields } from "~/domain/fields/eigentuemer/person/vertreter/adresse";

const VertreterAdresse: StepComponentFunction = ({ formData, i18n }) => {
  const fields = vertreterAdresseFields;
  fields.forEach((field) => {
    field.label = i18n[field.name];
  });
  return <Address fields={fields} formData={formData} />;
};

export default VertreterAdresse;
