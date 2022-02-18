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
  | VerheiratetData
  | AdresseData
  | GesetzlicherVertreterData
  | StepFormData;

export interface PersonData {
  adresse: AdresseData;
  gesetzlicherVertreter: GesetzlicherVertreterData;
}

export interface GrundDataModelData {
  eigentuemer: {
    anzahl: AnzahlData;
    verheiratet: VerheiratetData;
    person: PersonData[];
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
          hasVertreter: "",
        },
      },
    ],
  },
  grundstueck: {
    bebaut: "",
  },
};
