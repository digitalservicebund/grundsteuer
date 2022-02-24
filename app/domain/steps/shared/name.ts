import { StepDefinition } from "~/domain/steps";

export type NameFields = {
  anrede: string;
  titel: string;
  name: string;
  vorname: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    anrede: { validations: {} },
    titel: { validations: {} },
    name: { validations: {} },
    vorname: { validations: {} },
  },
};
