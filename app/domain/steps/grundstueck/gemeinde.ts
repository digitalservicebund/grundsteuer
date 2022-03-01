import { StepDefinition } from "~/domain/steps";

export type GrundstueckGemeindeFields = {
  innerhalbEinerGemeinde: "true" | "false";
};

export const grundstueckGemeinde: StepDefinition = {
  fields: {
    innerhalbEinerGemeinde: {
      type: "radio",
      validations: {},
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
