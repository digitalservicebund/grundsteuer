import { StepDefinition } from "~/domain/steps";

export type NameFields = {
  anrede: "no_anrede" | "frau" | "herr";
  titel: string;
  name: string;
  vorname: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    anrede: {
      type: "select",
      validations: {},
      options: [{ value: "no_anrede" }, { value: "frau" }, { value: "herr" }],
    },
    titel: { validations: {} },
    name: { validations: {} },
    vorname: { validations: {} },
  },
};
