import type { StepComponentFunction } from "~/routes/formular/_step";
import type { ConfigStepField } from "~/domain";
import { StepRadioField } from "~/components";

const Grundstueck: StepComponentFunction = ({ formData, i18n }) => {
  const bebaut: ConfigStepField = {
    name: "bebaut",
    label: "Bebaut?",
    validations: {},
    options: [
      {
        value: "true",
        label: "Ja",
      },
      {
        value: "false",
        label: "Nein",
      },
    ],
  };

  return <StepRadioField config={bebaut} value={formData?.[bebaut.name]} />;
};

export default Grundstueck;
