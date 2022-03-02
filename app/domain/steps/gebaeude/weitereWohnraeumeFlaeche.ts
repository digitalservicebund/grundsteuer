import { StepDefinition } from "~/domain/steps";

export type GebaeudeWeitereWohnraeumeFlaecheFields = {
  flaeche: string;
};

export const gebaeudeWeitereWohnraeumeFlaeche: StepDefinition = {
  fields: {
    flaeche: { validations: {} },
  },
};
