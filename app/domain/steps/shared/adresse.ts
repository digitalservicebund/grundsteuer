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
    telefonnummer: {
      validations: {
        maxLength: {
          maxLength: 16,
          msg: "Die Angabe darf maximal 16 Zeichen beinhalten",
        },
      },
    },
  },
};
