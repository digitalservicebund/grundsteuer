import { StepDefinition } from "~/domain/steps";

export type GebaeudeWohnflaecheFields = {
  wohnflaeche: string;
};

export const gebaeudeWohnflaeche: StepDefinition = {
  fields: {
    wohnflaeche: { validations: {} },
  },
};
