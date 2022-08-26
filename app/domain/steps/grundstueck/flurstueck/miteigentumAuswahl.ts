import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckMiteigentumAuswahlFields = {
  hasMiteigentum: "true" | "false";
};

export const grundstueckFlurstueckMiteigentumAuswahl: StepDefinition = {
  fields: {
    hasMiteigentum: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
