import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, StepFormFields, UebersichtStep } from "~/components";
import mediumImage from "~/assets/images/uebersicht-abschluss-medium.svg";

const EigentuemerAbschluss: StepComponentFunction = ({
  stepDefinition,
  currentState,
  allData,
  formData,
  i18n,
  errors,
}) => {
  return (
    <UebersichtStep imageSrc={mediumImage}>
      <ContentContainer size="sm">
        <StepFormFields
          {...{ stepDefinition, currentState, formData, i18n, errors, allData }}
        />
      </ContentContainer>
    </UebersichtStep>
  );
};

export default EigentuemerAbschluss;
