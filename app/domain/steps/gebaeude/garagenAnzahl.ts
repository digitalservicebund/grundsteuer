import { StepDefinition } from "~/domain/steps";

export type GebaeudeGaragenAnzahlFields = {
  anzahl: string;
};

export const gebaeudeGaragenAnzahl: StepDefinition = {
  fields: {
    anzahl: { validations: {} },
  },
};
