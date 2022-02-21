import _ from "lodash";

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

const modelTemplateWithDefaults = {
  eigentuemer: {
    anzahl: {
      anzahl: "1",
    },
    verheiratet: {
      areVerheiratet: "",
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
          hasVertreter: "",
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
    bebaut: "",
  },
};

export type GrundModel = typeof modelTemplateWithDefaults;
export const defaults: GrundModel = modelTemplateWithDefaults;
