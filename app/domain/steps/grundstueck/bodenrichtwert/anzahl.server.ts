import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstueckBodenrichtwertAnzahlFields = {
  anzahl: "1" | "2";
};

export const grundstueckBodenrichtwertAnzahl: StepDefinition = {
  fields: {
    anzahl: {
      type: "radio",
      validations: {
        required: { msg: "Bitte treffen Sie eine Auswahl" },
      },
      options: [{ value: "1" }, { value: "2" }],
    },
  },
};
