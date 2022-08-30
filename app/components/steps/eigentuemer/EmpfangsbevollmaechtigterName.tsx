import { ContentContainer, IntroText, StepFormFields } from "~/components";
import { StepComponentFunction } from "~/routes/formular/_step";

const EmpfangsbevollmaechtigterName: StepComponentFunction = ({
  stepDefinition,
  currentState,
  allData,
  formData,
  i18n,
  errors,
  testFeaturesEnabled,
}) => {
  const isBruchteilsgemeinschaft =
    Number(allData?.eigentuemer?.anzahl?.anzahl) > 1;
  return (
    <ContentContainer size="sm-md">
      {testFeaturesEnabled && isBruchteilsgemeinschaft && (
        <IntroText>
          An diese Person sendet das Finanzamt die Bescheide Grundsteuerwert-
          und Grundsteuermessbescheid. Der eigentliche Grundsteuerbescheid wird
          von der Gemeinde ausgestellt.
        </IntroText>
      )}
      <StepFormFields
        {...{ stepDefinition, currentState, formData, i18n, errors, allData }}
      />
    </ContentContainer>
  );
};

export default EmpfangsbevollmaechtigterName;
