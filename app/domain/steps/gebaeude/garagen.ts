import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeGaragenFields = {
  hasGaragen: "true" | "false";
};

export const gebaeudeGaragen: StepDefinition = {
  fields: {
    hasGaragen: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
