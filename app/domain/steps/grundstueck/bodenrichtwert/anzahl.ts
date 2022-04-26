import { StepDefinition } from "~/domain/steps";

export type GrundstueckBodenrichtwertAnzahlFields = {
  anzahl: "1" | "2";
};

export const grundstueckBodenrichtwertAnzahl: StepDefinition = {
  fields: {
    anzahl: {
      type: "radio",
      validations: {
        required: {},
      },
      options: [{ value: "1" }, { value: "2" }],
    },
  },
};
