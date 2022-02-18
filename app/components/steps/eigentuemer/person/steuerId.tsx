import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepTextField } from "~/components";
import { personSteuerIdField } from "~/domain/fields/eigentuemer/person/steuerId";

const SteuerId: StepComponentFunction = ({ formData, i18n }) => {
  const field = personSteuerIdField;
  field.label = i18n[field.name];

  return <StepTextField config={field} value={formData?.[field.name]} />;
};

export default SteuerId;
