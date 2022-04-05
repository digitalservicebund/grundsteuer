import { StepDefinition } from "~/domain/steps";

export type GebaeudeWohnflaecheFields = {
  wohnflaeche: string;
};

export const gebaeudeWohnflaeche: StepDefinition = {
  fields: {
    wohnflaeche: {
      validations: {
        required: {},
        onlyDecimal: {},
        noZero: {},
        maxLength: {
          maxLength: 6,
          msg: "Die Zahl darf nur bis zu 6 Ziffern beinhalten",
        },
      },
    },
  },
};
