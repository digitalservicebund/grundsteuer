import { StepDefinition } from "~/domain/steps";

export type GrundstueckFields = {
  bebaut: "true" | "false";
};

const stepDefinition: StepDefinition = {
  fields: {
    bebaut: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};

export default stepDefinition;
