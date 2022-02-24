import { StepDefinition } from "~/domain/steps";

export type EigentuemerAnzahlFields = {
  anzahl: "1" | "2" | "3" | "4" | "5";
};

const stepDefinition: StepDefinition = {
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
      ],
    },
  },
};

export default stepDefinition;
