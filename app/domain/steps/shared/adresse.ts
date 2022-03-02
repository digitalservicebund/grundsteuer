import { StepDefinition } from "~/domain/steps";

export type AdresseFields = {
  strasse: string;
  hausnummer: string;
  postfach: string;
  plz: string;
  ort: string;
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
          param: 200,
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
          param: 12,
          msg: "zu lang",
        },
      },
    },
    postfach: { validations: {} },
    plz: { validations: {} },
    ort: { validations: {} },
  },
};
