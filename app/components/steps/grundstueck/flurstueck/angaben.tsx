import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const GrundstueckFlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  currentState,
}) => {
  return (
    <div>
      <StepFormFields {...{ stepDefinition, formData, i18n, currentState }} />
    </div>
  );
};

export default GrundstueckFlurstueckAngaben;
