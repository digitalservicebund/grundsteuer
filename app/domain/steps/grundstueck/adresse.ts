import { StepDefinition } from "~/domain/steps";

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
      validations: {},
    },
    hausnummer: {
      validations: {},
    },
    zusatzangaben: { validations: {} },
    plz: { validations: {} },
    ort: { validations: {} },
    bundesland: {
      type: "select",
      options: [
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
      validations: {},
    },
  },
};
