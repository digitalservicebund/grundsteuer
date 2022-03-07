import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import { GrundstueckFlurstueckAngabenFields } from "~/domain/steps";

const GrundstueckFlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
}) => {
  /* Prefill form fields (defaults) with values from first step */
  const firstFlurstueckFormData =
    allData?.grundstueck?.flurstueck?.[0]?.angaben;
  const extendedStepDefinition = { ...stepDefinition };
  if (firstFlurstueckFormData) {
    Object.keys(firstFlurstueckFormData).forEach((key) => {
      const field = extendedStepDefinition.fields[key];
      if (field) {
        field.defaultValue =
          firstFlurstueckFormData[
            key as keyof GrundstueckFlurstueckAngabenFields
          ];
      }
    });
  }

  return (
    <div>
      <StepFormFields
        {...{ stepDefinition: extendedStepDefinition, formData, i18n }}
      />
    </div>
  );
};

export default GrundstueckFlurstueckAngaben;
