import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const Default: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
  allData,
}) => {
  return (
    <div>
      <StepFormFields
        {...{ stepDefinition, currentState, formData, i18n, errors, allData }}
      />
    </div>
  );
};

export default Default;
