import { StepComponentFunction } from "~/routes/formular/_step";
import Default from "~/components/steps/default";

const Freitext: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
  backUrl,
  currentStateWithoutId,
  errors,
}) => {
  return (
    <div>
      <div>{i18n.specifics.congratulations}</div>
      <Default
        {...{
          stepDefinition,
          formData,
          allData,
          i18n,
          backUrl,
          currentStateWithoutId,
          errors,
        }}
      />
      <div>{i18n.specifics.warning}</div>
    </div>
  );
};

export default Freitext;
