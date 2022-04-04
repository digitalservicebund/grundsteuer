import { StepDefinition } from "~/domain/steps";

export type GebaeudeBaujahrFields = {
  baujahr: string;
};

export const gebaeudeBaujahr: StepDefinition = {
  fields: {
    baujahr: {
      validations: {
        required: {},
        onlyDecimal: {},
        minLength: {
          minLength: 4,
          msg: "Die Jahreszahl muss aus genau vier Ziffern bestehen",
        },
        maxLength: {
          maxLength: 4,
          msg: "Die Jahreszahl muss aus genau vier Ziffern bestehen",
        },
        yearInPast: {},
      },
    },
  },
};
