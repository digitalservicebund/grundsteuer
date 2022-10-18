import { StepDefinition } from "~/domain/steps/index.server";

export type GebaeudeWohnflaecheFields = {
  wohnflaeche: string;
};

export const gebaeudeWohnflaeche: StepDefinition = {
  fields: {
    wohnflaeche: {
      validations: {
        required: {},
        onlyDecimal: {
          msg: "Darf nur Ziffern enthalten. Runden Sie die Flächenangabe auf oder ab.",
        },
        noZero: {},
        maxLength: {
          maxLength: 6,
          msg: "Die Zahl darf nur bis zu 6 Ziffern beinhalten",
        },
      },
    },
  },
};
