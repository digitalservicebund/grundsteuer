import { StepDefinition } from "~/domain/steps";

export type GrundstueckFlurstueckFlurFields = {
  flur: string;
  flurstueckZaehler: string;
  flurstueckNenner: string;
  wirtschaftlicheEinheitZaehler: string;
  wirtschaftlicheEinheitNenner: string;
};

export const grundstueckFlurstueckFlur: StepDefinition = {
  fields: {
    flur: {
      validations: {
        maxLength: {
          maxLength: 3,
          msg: "Die Angabe darf maximal 3 Ziffern lang sein",
        },
        onlyDecimal: {},
      },
    },
    flurstueckZaehler: {
      validations: {
        onlyDecimal: {},
        maxLength: {
          maxLength: 5,
          msg: "Die Angabe darf höchsten 5 Ziffern lang sein",
        },
        required: {},
      },
    },
    flurstueckNenner: {
      validations: {
        maxLength: {
          maxLength: 4,
          msg: "Die Angabe darf höchstens 4 Zeichen lang sein",
        },
      },
    },
    wirtschaftlicheEinheitZaehler: {
      validations: {
        required: {},
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
      },
    },
  },
};
