import { StepDefinition } from "~/domain/steps";

export type ZusammenfassungFields = {
  freitext: string;
};

export const zusammenfassung: StepDefinition = {
  fields: {
    freitext: {
      validations: {},
    },
  },
};
