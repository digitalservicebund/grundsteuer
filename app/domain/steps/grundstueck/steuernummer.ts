import { StepDefinition } from "~/domain/steps";

export type GrundstueckSteuernummerFields = {
  steuernummer: string;
};

export const grundstueckSteuernummer: StepDefinition = {
  fields: {
    steuernummer: {
      validations: {
        required: {},
      },
    },
  },
};
