import { StepDefinition } from "~/domain/steps";

export type GebaeudeWeitereWohnraeumeFlaecheFields = {
  anzahl: string;
  flaeche: string;
};

export const gebaeudeWeitereWohnraeumeFlaeche: StepDefinition = {
  fields: {
    anzahl: { validations: {} },
    flaeche: { validations: {} },
  },
};
