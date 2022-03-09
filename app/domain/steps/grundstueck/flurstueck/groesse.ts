import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckGroesseFields = {
  groesseHa: string;
  groesseA: string;
  groesseQm: string;
};

export const grundstueckFlurstueckGroesse: StepDefinition = {
  fields: {
    groesseHa: { validations: {} },
    groesseA: { validations: {} },
    groesseQm: { validations: {} },
  },
};
