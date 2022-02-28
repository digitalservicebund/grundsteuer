import { StepDefinition } from "~/domain/steps";

export type GebaeudeKernsanierungsjahrFields = {
  kernsanierungsjahr: string;
};

export const gebaeudeKernsanierungsjahr: StepDefinition = {
  fields: {
    kernsanierungsjahr: { validations: {} },
  },
};
