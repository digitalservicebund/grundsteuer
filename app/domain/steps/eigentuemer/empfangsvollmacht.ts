import { StepDefinition } from "~/domain/steps";

export type EigentuemerEmpfangsvollmachtFields = {
  hasEmpfangsvollmacht: "true" | "false";
};

export const eigentuemerEmpfangsvollmacht: StepDefinition = {
  fields: {
    hasEmpfangsvollmacht: {
      type: "radio",
      validations: {
        required: {},
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
