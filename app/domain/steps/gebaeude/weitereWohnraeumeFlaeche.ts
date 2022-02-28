import { StepDefinition } from "~/domain/steps";

export type GebaeudeWeitereWohnraeumeFlaecheFields = {
  wohnflaeche: string;
};

export const gebaeudeWeitereWohnraeumeFlaeche: StepDefinition = {
  fields: {
    flaeche: { validations: {} },
  },
};
