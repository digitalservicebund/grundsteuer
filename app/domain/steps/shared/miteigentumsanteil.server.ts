import { StepDefinition } from "~/domain/steps/index.server";

export type MiteigentumsanteilFields = {
  wirtschaftlicheEinheitZaehler: string;
  wirtschaftlicheEinheitNenner: string;
};

export const miteigentumsanteil: StepDefinition = {
  fields: {
    wirtschaftlicheEinheitZaehler: {
      validations: {
        required: {},
        float: {},
        noZero: {},
        maxLengthFloat: {
          preComma: 6,
          postComma: 4,
          msg: "Muss aus bis zu 6 Vorkommastellen und 4 Nachkommastellen bestehen.",
        },
      },
    },
    wirtschaftlicheEinheitNenner: {
      validations: {
        required: {},
        maxLength: {
          maxLength: 7,
          msg: "Die Angabe darf höchstens 7 Ziffern lang sein",
        },
        onlyDecimal: {},
        noZero: {},
        biggerThan: {
          dependentField: "wirtschaftlicheEinheitZaehler",
          msg: "Muss größer als der Zähler sein, um einen validen Anteil zu ergeben.",
        },
      },
    },
  },
};
