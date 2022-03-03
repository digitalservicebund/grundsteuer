import { StepDefinition } from "~/domain/steps";

export type EigentuemerFreitextFields = {
  freitext: string;
};

export const eigentuemerFreitext: StepDefinition = {
  fields: {
    freitext: {
      validations: {},
    },
  },
};
