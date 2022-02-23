import { StepDefinition } from "~/domain/steps";

const stepDefinition: StepDefinition = {
  fields: {
    areVerheiratet: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};

export default stepDefinition;
