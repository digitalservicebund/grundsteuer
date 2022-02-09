import { GebaeudeData } from "~/steps/gebaeude";
import { AdresseDataData } from "~/steps/adresse";
import { BebauungDataData } from "~/steps/bebauung";
import { BaseStepData } from "~/steps/baseStep";

interface SectionGrundstueckData {
  adresse: AdresseDataData;
  bebauung: BebauungDataData;
}

interface SectionGebaeudeData {
  gebaeudeart: GebaeudeData;
}

export interface GrundDataModelData {
  sectionGrundstueck: SectionGrundstueckData;
  sectionGebaeude: SectionGebaeudeData;
}

export default class GrundDataModel {
  sections: GrundDataModelData;

  constructor(sections: GrundDataModelData | undefined) {
    if (sections == undefined) {
      // TODO handle this correctly
      this.sections = {
        sectionGrundstueck: {
          adresse: {
            strasse: "",
            hausnummer: 0,
          },
          bebauung: {
            bebauung: "",
          },
        },
        sectionGebaeude: {
          gebaeudeart: {
            gebaeudeart: "",
          },
        },
      };
    } else {
      this.sections = sections;
    }
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

  getStepData(stepName: string) {
    // TODO make this recursive for indefinite levels
    for (const section in this.sections) {
      const section_steps: Record<string, any> =
        this.sections[section as keyof GrundDataModelData];
      if (section_steps[stepName] != undefined) {
        return section_steps[stepName];
      }
    }
  }

  serialize() {
    return JSON.stringify(this);
  }

  deserialize(jsonData: string) {
    return JSON.parse(jsonData);
  }
}
