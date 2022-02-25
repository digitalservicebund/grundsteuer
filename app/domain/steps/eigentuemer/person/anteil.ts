import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonAnteilFields = {
  zaehler: string;
  nenner: string;
};

export const eigentuemerPersonAnteil: StepDefinition = {
  fields: {
    zaehler: { validations: {} },
    nenner: { validations: {} },
  },
};
