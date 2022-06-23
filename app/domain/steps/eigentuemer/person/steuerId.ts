import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonSteuerIdFields = {
  steuerId: string;
};

export const eigentuemerPersonSteuerId: StepDefinition = {
  fields: {
    steuerId: {
      validations: {
        required: {},
        onlyDecimal: {
          exceptions: [" "],
        },
        minLength: {
          minLength: 11,
          exceptions: [" "],
          msg: "Die Steuer-Identifikationsnummer ist genau 11 Ziffern lang",
        },
        maxLength: {
          maxLength: 11,
          exceptions: [" "],
          msg: "Die Steuer-Identifikationsnummer ist genau 11 Ziffern lang",
        },
        isSteuerId: {},
        uniqueSteuerId: {},
      },
      type: "steuerId",
    },
  },
};
