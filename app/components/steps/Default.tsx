import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const Default: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
}) => {
  return (
    <div>
      <StepFormFields
        {...{ stepDefinition, currentState, formData, i18n, errors }}
      />
    </div>
  );
};

export default Default;
