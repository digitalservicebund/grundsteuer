import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonAnteilFields = {
  zaehler: string;
  nenner: string;
};

const stepDefinition: StepDefinition = {
  fields: {
    zaehler: { validations: {} },
    nenner: { validations: {} },
  },
};

export default stepDefinition;
