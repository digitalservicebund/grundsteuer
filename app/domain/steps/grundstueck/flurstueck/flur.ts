import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckFlurFields = {
  flur: string;
  flurstueckZaehler: string;
  flurstueckNenner: string;
  wirtschaftlicheEinheitZaehler: string;
  wirtschaftlicheEinheitNenner: string;
};

export const grundstueckFlurstueckFlur: StepDefinition = {
  fields: {
    flur: { validations: {} },
    flurstueckZaehler: { validations: {} },
    flurstueckNenner: { validations: {} },
    wirtschaftlicheEinheitZaehler: { validations: {} },
    wirtschaftlicheEinheitNenner: { validations: {} },
  },
};
