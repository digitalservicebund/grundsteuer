import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepTextField } from "~/components";
import { eigentuemerAnzahlField } from "~/domain/fields/eigentuemer/anzahl";

const Anzahl: StepComponentFunction = ({ formData, i18n }) => {
  const field = eigentuemerAnzahlField;
  field.label = i18n[field.name];

  return <StepTextField config={field} value={formData?.[field.name]} />;
};

export default Anzahl;
