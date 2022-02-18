import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepTextField } from "~/components";
import { personTelefonnummerField } from "~/domain/fields/eigentuemer/person/telefonnummer";

const Telefonnummer: StepComponentFunction = ({ formData, i18n }) => {
  const field = personTelefonnummerField;
  field.label = i18n[field.name];

  return <StepTextField config={field} value={formData?.[field.name]} />;
};

export default Telefonnummer;
