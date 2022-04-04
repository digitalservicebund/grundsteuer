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
        minLength: {
          maxLength: 10,
          msg: "Steuernummern/Aktenzeichen sind mindestens 10 Ziffern lang",
        },
        maxLength: {
          maxLength: 17,
          msg: "Steuernummern/Aktenzeichen sind höchstens 17 Ziffern lang",
        },
      },
    },
  },
};
