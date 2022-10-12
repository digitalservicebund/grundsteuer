import type { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, FormGroup, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";

const FlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
  allData,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  const typ = allData.grundstueck?.typ?.typ;

  const shouldDisplayGrundbuchblattnummer =
    typ !== "wohnungseigentum" ||
    allData.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp === "mixed";

  return (
    <ContentContainer size="sm-md">
      <div>
        <FormGroup>
          <StepFormField {...fieldProps[0]} currentState={currentState} />
        </FormGroup>
        {shouldDisplayGrundbuchblattnummer && (
          <FormGroup>
            <StepFormField {...fieldProps[1]} currentState={currentState} />
          </FormGroup>
        )}
      </div>
    </ContentContainer>
  );
};

export default FlurstueckAngaben;
