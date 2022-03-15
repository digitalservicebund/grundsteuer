import { StepDefinition } from "~/domain/steps";

export type GebaeudeWeitereWohnraeumeDetailsFields = {
  anzahl: string;
  flaeche: string;
};

export const gebaeudeWeitereWohnraeumeDetails: StepDefinition = {
  fields: {
    anzahl: { validations: {} },
    flaeche: { validations: {} },
  },
};
