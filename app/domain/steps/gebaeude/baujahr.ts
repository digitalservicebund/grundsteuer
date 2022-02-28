import { StepDefinition } from "~/domain/steps";

export type GebaeudeBaujahrFields = {
  baujahr: string;
};

export const gebaeudeBaujahr: StepDefinition = {
  fields: {
    baujahr: { validations: {} },
  },
};
