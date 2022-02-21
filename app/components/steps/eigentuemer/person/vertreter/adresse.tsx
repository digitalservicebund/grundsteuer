import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const VertreterAdresse: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
}) => {
  return <StepFormFields {...{ stepDefinition, formData, i18n }} />;
};

export default VertreterAdresse;
