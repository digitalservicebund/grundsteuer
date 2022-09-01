import { StepDefinition } from "~/domain/steps";

export type GrundstueckSteuernummerFields = {
  steuernummer: string;
};

export const grundstueckSteuernummer: StepDefinition = {
  fields: {
    steuernummer: {
      type: "steuernummer",
      validations: {
        required: {},
        minLength: {
          minLength: 10,
          exceptions: [" ", ".", "/"],
          msg: "Steuernummern/Aktenzeichen sind mindestens 10 Ziffern lang",
        },
        maxLength: {
          maxLength: 17,
          exceptions: [" ", ".", "/"],
          msg: "Steuernummern/Aktenzeichen sind höchstens 17 Ziffern lang",
        },
      },
    },
  },
};
