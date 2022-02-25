import { StepDefinition } from "~/domain/steps";

export type EigentuemerVerheiratetFields = {
  areVerheiratet: "true" | "false";
};

export const eigentuemerVerheiratet: StepDefinition = {
  fields: {
    areVerheiratet: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
