import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeWeitereWohnraeumeFields = {
  hasWeitereWohnraeume: "true" | "false";
};

export const gebaeudeWeitereWohnraeume: StepDefinition = {
  fields: {
    hasWeitereWohnraeume: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
