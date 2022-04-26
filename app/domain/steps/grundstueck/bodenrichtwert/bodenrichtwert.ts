import { StepDefinition } from "~/domain/steps";

export type GrundstueckBodenrichtwertFields = {
  bodenrichtwert: string;
};

export const grundstueckBodenrichtwert: StepDefinition = {
  fields: {
    bodenrichtwert: {
      validations: {
        required: {},
        float: {},
        maxLengthFloat: {
          preComma: 6,
          postComma: 2,
          msg: "Muss aus bis zu 6 Vorkommastellen und 2 Nachkommastellen bestehen.",
        },
      },
    },
  },
};
