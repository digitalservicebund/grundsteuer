import { StepDefinition } from "~/domain/steps";

export type GrundstueckMiteigentumAuswahlHausFields = {
  hasMiteigentum: "true" | "false";
};

export const grundstueckMiteigentumAuswahlHaus: StepDefinition = {
  fields: {
    hasMiteigentum: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "false" }, { value: "true" }],
    },
  },
};
