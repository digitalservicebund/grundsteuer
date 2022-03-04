import { StepDefinition } from "~/domain/steps";

export type NameFields = {
  anrede: string;
  titel: string;
  name: string;
  vorname: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    // TODO when Anrede becomes a dropdown: use these values: 'no_anrede' ,'herr', 'frau' to be compatible with erica
    anrede: { validations: {} },
    titel: { validations: {} },
    name: { validations: {} },
    vorname: { validations: {} },
  },
};
