import { StepDefinition } from "~/domain/steps";

export type GrundstueckBodenrichtwertFields = {
  bodenrichtwert: string;
};

export const grundstueckBodenrichtwert: StepDefinition = {
  fields: {
    bodenrichtwert: {
      validations: {},
    },
  },
};
