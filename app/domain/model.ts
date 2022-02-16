import _ from "lodash";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

export interface GrundDataModelData {
  repeated: {
    count: {
      count: string;
    };
    item: { name: { name: string } }[];
  };
  eigentuemer: SectionEigentuemer;
}

export interface SectionEigentuemer {
  person: PersonData;
}

interface AdresseData {
  strasse: string;
  hausnummer: string;
}

interface PersonData {
  adresse: AdresseData;
}

export default class GrundDataModel {
  sections: GrundDataModelData;

  constructor(sections: GrundDataModelData | undefined) {
    // TODO set default correctly
    const defaultSections = {
      repeated: {
        count: {
          count: "",
        },
        item: [{ name: { name: "" } }],
      },
      eigentuemer: {
        person: {
          adresse: {
            strasse: "",
            hausnummer: "",
            zusatzangaben: "",
            postfach: "",
            plz: "",
            ort: "",
          },
        },
      },
    };
    this.sections = { ...defaultSections, ...sections };
  }

  static idToIndex(path: string) {
    return path.split(".").map((s) => (s.match(/^\d+$/) ? parseInt(s) - 1 : s));
  }

  setStepData(path: string, values: any) {
    return _.set(this.sections, GrundDataModel.idToIndex(path), values);
  }

  getStepData(path: string) {
    return _.get(this.sections, GrundDataModel.idToIndex(path));
  }

  serialize() {
    return JSON.stringify(this);
  }

  deserialize(jsonData: string) {
    return JSON.parse(jsonData);
  }
}
