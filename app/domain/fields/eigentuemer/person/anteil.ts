import { ConfigStepField, ConfigStepFieldText } from "~/domain";

const zaehler: ConfigStepFieldText = {
  name: "zaehler",
  validations: {},
};

const nenner: ConfigStepFieldText = {
  name: "nenner",
  validations: {},
};

export const eigentuemerAnteilField: ConfigStepField[] = [zaehler, nenner];
