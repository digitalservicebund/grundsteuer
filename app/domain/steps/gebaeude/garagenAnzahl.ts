import { StepDefinition } from "~/domain/steps";

export type GebaeudeGaragenAnzahlFields = {
  anzahlGaragen: string;
};

export const gebaeudeGaragenAnzahl: StepDefinition = {
  fields: {
    anzahlGaragen: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 4,
          msg: "Die Zahl darf höchstens 4 Ziffern beinhalten",
        },
      },
    },
  },
};
