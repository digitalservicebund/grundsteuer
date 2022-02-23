import { StepDefinition } from "~/domain/steps";

const stepDefinition: StepDefinition = {
  fields: {
    anzahl: {
      type: "select",
      validations: {},
      options: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
      ],
    },
  },
};

export default stepDefinition;
