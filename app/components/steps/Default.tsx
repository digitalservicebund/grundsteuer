import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const Default: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  return (
    <div>
      {i18n.description && <div className="mb-16">{i18n.description}</div>}
      <StepFormFields {...{ stepDefinition, formData, i18n, errors }} />
    </div>
  );
};

export default Default;
