import { StepDefinition } from "~/domain/steps";

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
          excludingCurrentYear: true,
          msg: "Das Jahr muss vor dem Feststellungszeitpunkt liegen - also vor 2022 kernsaniert worden sein.",
        },
        yearAfterBaujahr: {},
      },
    },
  },
};
