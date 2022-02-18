import { ConfigStepField } from "~/domain";

const strasse: ConfigStepField = {
  name: "strasse",
  validations: {
    requiredIf: {
      dependentField: "hausnummer",
      msg: "musst du eingeben",
    },
    maxLength: {
      param: 12,
      msg: "zu lang",
    },
  },
};

const hausnummer: ConfigStepField = {
  name: "hausnummer",
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
};

const zusatzangaben: ConfigStepField = {
  name: "zusatzangaben",
  validations: {},
};

const postfach: ConfigStepField = {
  name: "postfach",
  validations: {},
};

const plz: ConfigStepField = {
  name: "plz",
  validations: {},
};

const ort: ConfigStepField = {
  name: "ort",
  validations: {},
};

export const personAdresseFields: ConfigStepField[] = [
  strasse,
  hausnummer,
  zusatzangaben,
  postfach,
  plz,
  ort,
];
