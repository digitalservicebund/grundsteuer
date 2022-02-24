import _ from "lodash";

import type { GrundModel } from "~/domain/steps";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

const idToIndex = (path: string) => {
  return path.split(".").map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s));
};

export const setStepData = (
  data: GrundModel,
  path: string,
  values: StepFormData
) => {
  return _.set(data, idToIndex(path), values);
};

export const getStepData = (data: GrundModel, path: string) => {
  return _.get(data, idToIndex(path));
};

const modelTemplateWithDefaults: GrundModel = {
  eigentuemer: {
    anzahl: {
      anzahl: "1",
    },
    verheiratet: {
      areVerheiratet: "false",
    },
    person: [
      {
        name: {
          anrede: "",
          titel: "",
          name: "",
          vorname: "",
        },
        adresse: {
          strasse: "",
          hausnummer: "",
          zusatzangaben: "",
          postfach: "",
          plz: "",
          ort: "",
        },
        telefonnummer: {
          telefonnummer: "",
        },
        steuerId: {
          steuerId: "",
        },
        gesetzlicherVertreter: {
          hasVertreter: "false",
        },
        vertreter: {
          name: {
            anrede: "",
            titel: "",
            name: "",
            vorname: "",
          },
          adresse: {
            strasse: "",
            hausnummer: "",
            zusatzangaben: "",
            postfach: "",
            plz: "",
            ort: "",
          },
          telefonnummer: {
            telefonnummer: "",
          },
        },
        anteil: {
          zaehler: "",
          nenner: "",
        },
      },
    ],
  },
  grundstueck: {
    bebaut: "false",
  },
};

export const defaults = modelTemplateWithDefaults;
