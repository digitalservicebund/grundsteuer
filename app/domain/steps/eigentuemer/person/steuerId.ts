import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonSteuerIdFields = {
  steuerId: string;
};

export const eigentuemerPersonSteuerId: StepDefinition = {
  fields: {
    steuerId: { validations: {}, type: "steuerId" },
  },
};
