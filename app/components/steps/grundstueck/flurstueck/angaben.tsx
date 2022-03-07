import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const GrundstueckFlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
}) => {
  return (
    <div>
      <StepFormFields {...{ stepDefinition, formData, i18n }} />
    </div>
  );
};

export default GrundstueckFlurstueckAngaben;
