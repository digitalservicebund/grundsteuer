import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstueckMiteigentumAuswahlWohnungFields = {
  miteigentumTyp: "none" | "garage" | "sondernutzung" | "mixed";
};

export const grundstueckMiteigentumAuswahlWohnung: StepDefinition = {
  fields: {
    miteigentumTyp: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [
        { value: "none" },
        { value: "garage" },
        { value: "sondernutzung" },
        { value: "mixed" },
      ],
    },
  },
};
