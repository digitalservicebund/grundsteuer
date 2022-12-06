import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeKernsanierungsjahrFields = {
  kernsanierungsjahr: string;
};

export const gebaeudeKernsanierungsjahr: StepDefinition = {
  fields: {
    kernsanierungsjahr: {
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
        yearInPast: {
          excludingVeranlagungszeitraum: true,
          msg: "Das Jahr der Kernsanierung muss vor dem Stichtag der Hauptfeststellung liegen - also vor dem 01.01.2022.",
        },
        yearAfterBaujahr: {},
      },
    },
  },
};
