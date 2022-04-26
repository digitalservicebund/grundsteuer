import { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const BodenrichtwertEingabe: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  return (
    <div>
      <div className="mb-16">{i18n.specifics.explanation}</div>
      <StepFormFields {...{ stepDefinition, formData, i18n, errors }} />
    </div>
  );
};

export default BodenrichtwertEingabe;
