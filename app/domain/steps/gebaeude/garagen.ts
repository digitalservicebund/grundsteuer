import { StepDefinition } from "~/domain/steps";

export type GebaeudeGaragenFields = {
  hasGaragen: "true" | "false";
};

export const gebaueGaragen: StepDefinition = {
  fields: {
    hasGaragen: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
