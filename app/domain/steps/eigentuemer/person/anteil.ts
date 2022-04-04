import { StepDefinition } from "~/domain/steps";

export type EigentuemerPersonAnteilFields = {
  zaehler: string;
  nenner: string;
};

export const eigentuemerPersonAnteil: StepDefinition = {
  fields: {
    zaehler: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 8,
          msg: "Die Angabe darf nur bis zu 8 Ziffern lang sein",
        },
      },
    },
    nenner: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 9,
          msg: "Die Angabe darf nur bis zu 9 Ziffern lang sein",
        },
        biggerThan: {
          dependentField: "zaehler",
          msg: "Muss größer als der Zähler sein, um einen validen Anteil zu ergeben.",
        },
      },
    },
  },
};
