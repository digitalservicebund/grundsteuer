import { StepDefinition } from "~/domain/steps";

export type GrundstueckMiteigentumAuswahlWohnungFields = {
  miteigentumTyp: "none" | "garage" | "mixed";
};

export const grundstueckMiteigentumAuswahlWohnung: StepDefinition = {
  fields: {
    miteigentumTyp: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "none" }, { value: "garage" }, { value: "mixed" }],
    },
  },
};
