import _ from "lodash";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

interface AnzahlData {
  anzahl: string;
}

interface VerheiratetData {
  areVerheiratet: string;
}

interface BebautData {
  bebaut: string;
}

interface AdresseData {
  strasse: string;
  hausnummer: string;
  zusatzangaben: string;
  postfach: string;
  plz: string;
  ort: string;
}

interface GesetzlicherVertreterData {
  hasVertreter: string;
}

export type StepData =
  | AnzahlData
  | AdresseData
  | GesetzlicherVertreterData
  | StepFormData;

export interface GrundDataModelData {
  eigentuemer: {
    anzahl: AnzahlData;
    verheiratet: VerheiratetData;
    person: {
      adresse: AdresseData;
      gesetzlicherVertreter: GesetzlicherVertreterData;
    }[];
  };
  grundstueck: BebautData;
}

const idToIndex = (path: string) => {
  return path.split(".").map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s));
};

export const setStepData = (
  data: GrundDataModelData,
  path: string,
  values: StepData
) => {
  return _.set(data, idToIndex(path), values);
};

export const getStepData = (data: GrundDataModelData, path: string) => {
  return _.get(data, idToIndex(path));
};

export const defaults: GrundDataModelData = {
  eigentuemer: {
    anzahl: {
      anzahl: "1",
    },
    verheiratet: {
      areVerheiratet: "",
    },
    person: [
      {
        adresse: {
          strasse: "",
          hausnummer: "",
          zusatzangaben: "",
          postfach: "",
          plz: "",
          ort: "",
        },
        gesetzlicherVertreter: {
          hasVertreter: "false",
        },
      },
    ],
  },
  grundstueck: {
    bebaut: "",
  },
};
