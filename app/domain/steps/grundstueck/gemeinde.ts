import { StepDefinition } from "~/domain/steps";

export type GrundstueckGemeindeFields = {
  innerhalbEinerGemeinde: "true" | "false";
};

export const grundstueckGemeinde: StepDefinition = {
  fields: {
    innerhalbEinerGemeinde: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
