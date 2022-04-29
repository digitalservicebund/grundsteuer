import { StepDefinition } from "~/domain/steps";

export type GrundstueckBodenrichtwertEingabeFields = {
  bodenrichtwert: string;
};

export const grundstueckBodenrichtwertEingabe: StepDefinition = {
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
