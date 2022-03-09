import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckAngabenFields = {
  grundbuchblattnummer: string;
  gemarkung: string;
};

export const grundstueckFlurstueckAngaben: StepDefinition = {
  fields: {
    grundbuchblattnummer: {
      validations: {},
    },
    gemarkung: {
      validations: {},
    },
  },
};
