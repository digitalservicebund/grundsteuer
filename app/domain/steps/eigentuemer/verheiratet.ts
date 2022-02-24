import { StepDefinition } from "~/domain/steps";

export type EigentuemerVerheiratetFields = {
  areVerheiratet: "true" | "false";
};

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
