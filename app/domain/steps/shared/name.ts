import { StepDefinition } from "~/domain/steps";

export type NameFields = {
  anrede: "no_anrede" | "frau" | "herr";
  titel: string;
  name: string;
  vorname: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    // TODO when Anrede becomes a dropdown: use these values: 'no_anrede' ,'herr', 'frau' to be compatible with erica
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
