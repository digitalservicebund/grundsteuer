import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonGesetzlicherVertreterFields = {
  hasVertreter: "true" | "false";
};

const stepDefinition: StepDefinition = {
  fields: {
    hasVertreter: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};

export default stepDefinition;
