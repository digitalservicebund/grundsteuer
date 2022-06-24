import { StepDefinition } from "~/domain/steps";

export type EigentuemerBruchteilsgemeinschaftFields = {
  predefinedData: "true" | "false";
};

export const eigentuemerBruchteilsgemeinschaft: StepDefinition = {
  fields: {
    predefinedData: {
      type: "radio",
      options: [{ value: "true" }, { value: "false" }],
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
    },
  },
};
