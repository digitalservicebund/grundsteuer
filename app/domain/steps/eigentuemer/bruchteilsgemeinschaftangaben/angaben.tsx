import { StepDefinition } from "~/domain/steps";
import { AdresseFields } from "~/domain/steps/shared/adresse";

export type EigentuemerBruchteilsgemeinschaftAngabenFields = AdresseFields & {
  name: string;
};

export const eigentuemerBruchteilsgemeinschaftAngaben: StepDefinition = {
  fields: {
    name: {
      validations: {},
    },
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
  },
};
