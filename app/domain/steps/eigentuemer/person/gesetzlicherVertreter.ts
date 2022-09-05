import { StepDefinition } from "~/domain/steps/index.server";

export type EigentuemerPersonGesetzlicherVertreterFields = {
  hasVertreter: "true" | "false";
};

export const eigentuemerPersonGesetzlicherVertreter: StepDefinition = {
  fields: {
    hasVertreter: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "true" }, { value: "false" }],
    },
  },
};
