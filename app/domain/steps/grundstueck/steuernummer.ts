import { StepDefinition } from "~/domain/steps";

export type GrundstueckSteuernummerFields = {
  steuernummer: string;
};

export const grundstueckSteuernummer: StepDefinition = {
  fields: {
    steuernummer: {
      validations: {
        required: {},
        onlyDecimal: {},
        maxLength: {
          maxLength: 17,
          msg: "Steuernummern/Aktenzeichen sind höchstens 17 Ziffern lang",
        },
      },
    },
  },
};
