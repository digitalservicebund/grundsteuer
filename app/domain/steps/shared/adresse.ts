import { StepDefinition } from "~/domain/steps";

export type AdresseFields = {
  strasse: string;
  hausnummer: string;
  postfach: string;
  plz: string;
  ort: string;
  telefonnummer: string;
};

export const stepDefinition: StepDefinition = {
  fields: {
    strasse: {
      validations: {
        requiredIf: {
          dependentField: "hausnummer",
          msg: "musst du eingeben",
        },
        maxLength: {
          maxLength: 200,
          msg: "zu lang",
        },
      },
    },
    hausnummer: {
      validations: {
        requiredIf: {
          dependentField: "strasse",
          msg: "musst du eingeben",
        },
        maxLength: {
          maxLength: 12,
          msg: "zu lang",
        },
      },
    },
    postfach: { validations: {} },
    plz: { validations: {} },
    ort: { validations: {} },
    telefonnummer: { validations: {} },
  },
};
