import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepRadioField } from "~/components";
import { gesVertreterField } from "~/domain/fields/eigentuemer/person/gesetzlicherVertreter";

const GesetzlicherVertreter: StepComponentFunction = ({ formData, i18n }) => {
  const field = gesVertreterField;
  field.label = i18n.question;
  field.options[0].label = i18n.yes;
  field.options[1].label = i18n.no;
  return (
    <>
      <StepRadioField config={field} value={formData?.[field.name]} />
    </>
  );
};

export default GesetzlicherVertreter;
