import { StepDefinition } from "~/domain/steps";

export type GrundstueckBodenrichtwertEingabeFields = {
  bodenrichtwert: string;
};

export const grundstueckBodenrichtwertEingabe: StepDefinition = {
  fields: {
    bodenrichtwert: {
      validations: {
        required: {},
        noZero: {},
        float: {
          msg: "Die Angabe muss eine Zahl sein, die durch ein Komma getrennt sein kann. Geben Sie keine Einheiten ein.",
        },
        maxLengthFloat: {
          preComma: 6,
          postComma: 2,
          msg: "Muss aus bis zu 6 Vorkommastellen und 2 Nachkommastellen bestehen.",
        },
      },
    },
  },
};
