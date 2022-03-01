import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckAngabenFields = {
  grundbuchblattnummer: string;
  gemarkung: string;
  flur: string;
  flurstueckZaehler: string;
  flurstueckNenner: string;
  wirtschaftlicheEinheitZaehler: string;
  wirtschaftlicheEinheitNenner: string;
  groesseHa: string;
  groesseA: string;
  groesseQm: string;
};

export const grundstueckFlurstueckAngaben: StepDefinition = {
  fields: {
    grundbuchblattnummer: {
      validations: {},
    },
    gemarkung: {
      validations: {},
    },
    flur: { validations: {} },
    flurstueckZaehler: { validations: {} },
    flurstueckNenner: { validations: {} },
    wirtschaftlicheEinheitZaehler: { validations: {} },
    wirtschaftlicheEinheitNenner: { validations: {} },
    groesseHa: { validations: {} },
    groesseA: { validations: {} },
    groesseQm: { validations: {} },
  },
};
