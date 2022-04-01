import { StepDefinition } from "~/domain/steps";
import { conditions } from "~/domain/guards";

export type GrundstueckAdresseFields = {
  strasse: string;
  hausnummer: string;
  zusatzangaben: string;
  plz: string;
  ort: string;
  bundesland:
    | "BE"
    | "BB"
    | "HB"
    | "MV"
    | "NW"
    | "RP"
    | "SL"
    | "SN"
    | "ST"
    | "SH"
    | "TH";
};

export const grundstueckAdresse: StepDefinition = {
  fields: {
    strasse: {
      validations: {
        requiredIfCondition: {
          condition: conditions.isBebaut,
          msg: "Muss ausgefüllt werden, wenn Grundstück bebaut ist",
        },
        maxLength: {
          maxLength: 25,
          msg: "Darf maximal 25 Zeichen lang sein",
        },
      },
    },
    hausnummer: {
      validations: {
        hausnummer: {},
      },
    },
    zusatzangaben: {
      validations: {
        maxLength: {
          maxLength: 25,
          msg: "Darf maximal 25 Zeichen lang sein",
        },
      },
    },
    plz: {
      validations: {
        requiredIfCondition: {
          condition: conditions.isBebaut,
          msg: "Muss ausgefüllt werden, wenn Grundstück bebaut ist",
        },
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
          msg: "Darf maximal 25 Zeichen lang sein",
        },
      },
    },
    bundesland: {
      type: "select",
      options: [
        { value: "default", defaultOption: true },
        { value: "BE" },
        { value: "BB" },
        { value: "HB" },
        { value: "MV" },
        { value: "NW" },
        { value: "RP" },
        { value: "SL" },
        { value: "SN" },
        { value: "ST" },
        { value: "SH" },
        { value: "TH" },
      ],
      validations: {
        required: {},
      },
    },
  },
};
