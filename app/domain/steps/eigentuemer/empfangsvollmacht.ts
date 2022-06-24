import { StepDefinition } from "~/domain/steps";

export type EigentuemerEmpfangsvollmachtFields = {
  hasEmpfangsvollmacht: "true" | "false";
};

export const eigentuemerEmpfangsvollmacht: StepDefinition = {
  fields: {
    hasEmpfangsvollmacht: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
