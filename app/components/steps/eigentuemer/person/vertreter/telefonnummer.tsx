import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepTextField } from "~/components";
import { vertreterTelefonnummerField } from "~/domain/fields/eigentuemer/person/vertreter/telefonnummer";

const VertreterTelefonnummer: StepComponentFunction = ({ formData, i18n }) => {
  const field = vertreterTelefonnummerField;
  field.label = i18n[field.name];
  return <StepTextField config={field} value={formData?.[field.name]} />;
};

export default VertreterTelefonnummer;
