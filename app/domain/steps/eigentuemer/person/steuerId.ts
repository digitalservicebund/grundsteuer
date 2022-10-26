import { StepDefinition } from "~/domain/steps/index.server";

export type EigentuemerPersonSteuerIdFields = {
  steuerId: string;
};

export const eigentuemerPersonSteuerId: StepDefinition = {
  optional: true,
  fields: {
    steuerId: {
      validations: {
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
