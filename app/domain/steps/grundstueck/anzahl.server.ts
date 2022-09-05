import { StepDefinition } from "~/domain/steps/index.server";

export type GrundstueckAnzahlFields = {
  anzahl:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20";
};

export const grundstueckAnzahl: StepDefinition = {
  fields: {
    anzahl: {
      type: "select",
      validations: {
        required: {},
      },
      options: [
        { value: "default", defaultOption: true },
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
        { value: "11" },
        { value: "12" },
        { value: "13" },
        { value: "14" },
        { value: "15" },
        { value: "16" },
        { value: "17" },
        { value: "18" },
        { value: "19" },
        { value: "20" },
      ],
    },
  },
};
