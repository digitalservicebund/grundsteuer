import { GebaeudeDataData } from "~/domain/steps/gebaeude";
import { AdresseDataData } from "~/domain/steps/adresse";
import { BebauungDataData } from "~/domain/steps/bebauung";
import { BaseStepData } from "~/domain/steps/baseStep";

interface SectionGrundstueckData {
  adresse: AdresseDataData;
  bebauung: BebauungDataData;
  gebaeude: GebaeudeDataData;
}

export interface SectionEigentuemer {
  person: PersonData;
}

interface PersonData {
  adresse: AdresseDataData;
}

export interface GrundDataModelData {
  legacy: SectionGrundstueckData;
  eigentuemer: SectionEigentuemer;
}

export default class GrundDataModel {
  sections: GrundDataModelData;

  constructor(sections: GrundDataModelData | undefined) {
    // TODO set default correctly
    const defaultSections = {
      legacy: {
        adresse: {
          strasse: "",
          hausnummer: 0,
        },
        bebauung: {
          bebauung: "",
        },
        gebaeude: {
          gebaeudeart: "",
        },
      },
      eigentuemer: {
        person: {
          adresse: {
            strasse: "",
            hausnummer: 0,
          },
        },
      },
    };
    this.sections = { ...defaultSections, ...sections };
  }

  addStepData(stepName: string, stepModelData: BaseStepData) {
    Object.keys(this.sections).forEach((section: string) => {
      const section_steps: Record<string, any> =
        this.sections[section as keyof GrundDataModelData];
      if (section_steps[stepName] != undefined) {
        section_steps[stepName] = stepModelData.data;
      }
    });
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
