import React from "react";
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
      {i18n.specifics.warning}
    </div>
  );
};

export default Freitext;
