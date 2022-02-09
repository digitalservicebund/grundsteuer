import { GebaeudeData } from "~/steps/gebaeude";
import { AdresseDataData } from "~/steps/adresse";
import { BebauungDataData } from "~/steps/bebauung";
import { BaseStepData } from "~/steps/baseStep";

interface AreaGrundstueckData {
  adresse: AdresseDataData;
  bebauung: BebauungDataData;
}

interface AreaGebaeudeData {
  gebaeudeart: GebaeudeData;
}

export interface GrundDataModelData {
  areaGrundstueck: AreaGrundstueckData;
  areaGebaeude: AreaGebaeudeData;
}

export default class GrundDataModel {
  areas: GrundDataModelData;

  constructor(areas: GrundDataModelData | undefined) {
    console.log("AREAS");
    console.log(areas);
    if (areas == undefined) {
      // TODO handle this correctly
      this.areas = {
        areaGrundstueck: {
          adresse: {
            strasse: "",
            hausnummer: 0,
          },
          bebauung: {
            bebauung: "",
          },
        },
        areaGebaeude: {
          gebaeudeart: {
            gebaeudeart: "",
          },
        },
      };
    } else {
      this.areas = areas;
    }
    console.log(this.areas);
  }

  addStepData(stepName: string, stepModelData: BaseStepData) {
    Object.keys(this.areas).forEach((area: string) => {
      const area_steps: Record<string, any> =
        this.areas[area as keyof GrundDataModelData];
      if (area_steps[stepName] != undefined) {
        area_steps[stepName] = stepModelData.data;
      }
    });
  }

  getStepData(stepName: string) {
    // TODO make this recursive for indefinite levels
    for (const area in this.areas) {
      const area_steps: Record<string, any> =
        this.areas[area as keyof GrundDataModelData];
      if (area_steps[stepName] != undefined) {
        return area_steps[stepName];
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
