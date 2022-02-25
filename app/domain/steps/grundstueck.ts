import { StepDefinition } from "~/domain/steps";

export type GrundstueckFields = {
  bebaut: "true" | "false";
};

export const grundstueck: StepDefinition = {
  fields: {
    bebaut: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
