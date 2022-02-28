import { StepDefinition } from "~/domain/steps";

export type GebaeudeWohnflaechenFields = {
  wohnflaeche1: string;
  wohnflaeche2: string;
};

export const gebaeudeWohnflaechen: StepDefinition = {
  fields: {
    wohnflaeche1: { validations: {} },
    wohnflaeche2: { validations: {} },
  },
};
