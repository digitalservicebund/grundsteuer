import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeWeitereWohnraeumeDetailsFields = {
  anzahl: string;
  flaeche: string;
};

export const gebaeudeWeitereWohnraeumeDetails: StepDefinition = {
  fields: {
    anzahl: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 3,
          msg: "Die Zahl darf maximal 3 Ziffern beinhalten.",
        },
      },
    },
    flaeche: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 6,
          msg: "Die Zahl darf maximal 6 Ziffern beinhalten.",
        },
      },
    },
  },
};
