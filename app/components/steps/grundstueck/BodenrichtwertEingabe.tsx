import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import Hint from "~/components/Hint";

const BodenrichtwertEingabe: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
  errors,
  currentState,
}) => {
  return (
    <div>
      {allData.grundstueck?.bodenrichtwertAnzahl?.anzahl === "2" && (
        <Hint>{i18n.specifics.zweiBodenrichtwerteHinweis}</Hint>
      )}
      <StepFormFields
        {...{ stepDefinition, currentState, formData, i18n, errors }}
      />
    </div>
  );
};

export default BodenrichtwertEingabe;
