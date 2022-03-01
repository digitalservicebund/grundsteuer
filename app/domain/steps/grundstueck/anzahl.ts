import { StepDefinition } from "~/domain/steps";

export type GrundstueckAnzahlFields = {
  anzahl: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
};

export const grundstueckAnzahl: StepDefinition = {
  fields: {
    anzahl: {
      type: "select",
      validations: {},
      options: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
        { value: "6" },
        { value: "7" },
        { value: "8" },
        { value: "9" },
        { value: "10" },
      ],
    },
  },
};
