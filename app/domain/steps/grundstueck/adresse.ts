import { StepDefinition } from "~/domain/steps";

export type GrundstueckAdresseFields = {
  strasse: string;
  hausnummer: string;
  zusatzangaben: string;
  plz: string;
  ort: string;
};

export const grundstueckAdresse: StepDefinition = {
  fields: {
    strasse: {
      validations: {},
    },
    hausnummer: {
      validations: {},
    },
    zusatzangaben: { validations: {} },
    plz: { validations: {} },
    ort: { validations: {} },
  },
};
