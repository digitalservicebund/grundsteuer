import type { StepComponentFunction } from "~/routes/formular/_step";
import { Address } from "~/components";
import { personAdresseFields } from "~/domain/fields/eigentuemer/person/adresse";

const Adresse: StepComponentFunction = ({ formData, i18n }) => {
  personAdresseFields.forEach((field) => {
    field.label = i18n[field.name];
  });

  return <Address fields={personAdresseFields} formData={formData} />;
};

export default Adresse;
