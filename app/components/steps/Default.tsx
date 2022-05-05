import type { StepComponentFunction } from "~/routes/formular/_step";
import { IntroText, StepFormFields } from "~/components";

const Default: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  return (
    <div>
      {i18n.description && <IntroText>{i18n.description}</IntroText>}
      <StepFormFields {...{ stepDefinition, formData, i18n, errors }} />
    </div>
  );
};

export default Default;
