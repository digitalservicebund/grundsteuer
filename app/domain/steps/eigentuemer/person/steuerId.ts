import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonSteuerIdFields = {
  steuerId: string;
};

const stepDefinition: StepDefinition = {
  fields: {
    steuerId: { validations: {} },
  },
};

export default stepDefinition;
