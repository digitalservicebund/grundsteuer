import { StepDefinition } from "~/domain/steps";

export type GebaeudeAbbruchverpflichtungsjahrFields = {
  abbruchverpflichtungsjahr: string;
};

export const gebaeudeAbbruchverpflichtungsjahrjahr: StepDefinition = {
  fields: {
    abbruchverpflichtungsjahr: {
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
        yearInFuture: {},
      },
    },
  },
};
