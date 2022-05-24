import { StepDefinition } from "~/domain/steps";

export interface EigentuemerBruchteilsgemeinschaftAngabenFields
  extends EigentuemerBruchteilsgemeinschaftAdresseFields {
  name: string;
}

export type EigentuemerBruchteilsgemeinschaftAdresseFields = {
  strasse: string;
  hausnummer: string;
  postfach?: string;
  plz: string;
  ort: string;
};

export const eigentuemerBruchteilsgemeinschaftAngaben: StepDefinition = {
  fields: {
    name: {
      validations: {
        required: {},
        maxLength: {
          // Name 1+2
          maxLength: 50,
          msg: "Der Name darf maximal 50 Zeichen umfassen",
        },
      },
    },
    strasse: {
      validations: {
        eitherOr: {
          dependentField: "postfach",
          msg: "Geben Sie nur genau eine Adresse an (entweder Straßenadresse oder Postfachadresse)",
        },
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen beinhalten",
        },
      },
    },
    hausnummer: {
      validations: {
        hausnummer: {},
        forbiddenIf: {
          dependentField: "postfach",
          msg: "Darf bei einer Postfachadresse nicht angegeben werden",
        },
      },
    },
    postfach: {
      validations: {
        eitherOr: {
          dependentField: "strasse",
          msg: "Geben Sie nur genau eine Adresse an (entweder Straßenadresse oder Postfachadresse)",
        },
        onlyDecimal: {},
        maxLength: {
          maxLength: 6,
          msg: "Darf bis zu 6 Ziffern lang sein",
        },
      },
    },
    plz: {
      validations: {
        required: {},
        onlyDecimal: {},
        minLength: {
          minLength: 5,
          msg: "Muss genau 5 Zeichen lang sein",
        },
        maxLength: {
          maxLength: 5,
          msg: "Muss genau 5 Zeichen lang sein",
        },
      },
    },
    ort: {
      validations: {
        required: {},
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen beinhalten",
        },
      },
    },
  },
};
