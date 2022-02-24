import { StepDefinition } from "~/domain/steps";

export type TelefonnummerFields = {
  telefonnummer: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    telefonnummer: { validations: {} },
  },
};
