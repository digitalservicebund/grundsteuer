import { StepDefinition } from "~/domain/steps";

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
