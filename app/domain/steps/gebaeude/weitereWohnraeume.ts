import { StepDefinition } from "~/domain/steps";

export type GebaeudeWeitereWohnraeumeFields = {
  hasWeitereWohnraeume: "true" | "false";
};

export const gebaeudeWeitereWohnraeume: StepDefinition = {
  fields: {
    hasWeitereWohnraeume: {
      type: "radio",
      validations: {
        required: {},
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
