import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonSteuerIdFields = {
  steuerId: string;
};

export const eigentuemerPersonSteuerId: StepDefinition = {
  fields: {
    steuerId: { validations: {}, placeholder: "99 999 999 999" },
  },
};
