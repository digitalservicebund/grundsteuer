import { StepDefinition } from "~/domain/steps/index.server";

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
        yearInPast: {
          excludingVeranlagungszeitraum: true,
          msg: "Das Baujahr muss vor dem Stichtag der Hauptfeststellung liegen - also vor dem 01.01.2022.",
        },
        minValue: {
          minValue: 1949,
          msg: "Wenn das Baujahr vor 1949 liegt, tragen Sie das in der vorherigen Seite entsprechend ein",
        },
      },
    },
  },
};
