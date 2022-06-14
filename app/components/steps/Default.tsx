import type { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, StepFormFields } from "~/components";

const Default: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
  allData,
}) => {
  return (
    <ContentContainer size="sm-md">
      <StepFormFields
        {...{ stepDefinition, currentState, formData, i18n, errors, allData }}
      />
    </ContentContainer>
  );
};

export default Default;
