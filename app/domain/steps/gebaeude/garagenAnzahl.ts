import { StepDefinition } from "~/domain/steps";

export type GebaeudeGaragenAnzahlFields = {
  anzahlGaragen: string;
};

export const gebaeudeGaragenAnzahl: StepDefinition = {
  fields: {
    anzahlGaragen: { validations: {} },
  },
};
