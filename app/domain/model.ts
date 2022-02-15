import _ from "lodash";

export type StepFormDataValue = string | undefined;
export type StepFormData = Record<string, StepFormDataValue>;

export interface GrundDataModelData {
  repeated: {
    count: number;
    currentIndex: number;
    item: {
      name: string
    }
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
        count: 0,
        currentIndex: 0,
        item:{
          name: ""
        }
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

  setStepData(path: string, values: any) {
    _.set(this.sections, path, values);
  }

  getStepData(stepHierarchy: string) {
    const hierarchyLevels = stepHierarchy.split(".");
    let currentDataLevel: Record<string, any> = this.sections;
    hierarchyLevels.forEach((hierachyLevel) => {
      currentDataLevel =
        currentDataLevel[hierachyLevel as keyof GrundDataModelData];
    });
    return currentDataLevel;
  }

  serialize() {
    return JSON.stringify(this);
  }

  deserialize(jsonData: string) {
    return JSON.parse(jsonData);
  }
}
