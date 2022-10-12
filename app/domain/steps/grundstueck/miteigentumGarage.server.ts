import { StepDefinition } from "~/domain/steps/index.server";
import {
  miteigentumsanteil,
  MiteigentumsanteilFields,
} from "~/domain/steps/shared/miteigentumsanteil.server";
import { conditions } from "~/domain/states/guards";

export type GrundstueckMiteigentumGarageFields = MiteigentumsanteilFields & {
  grundbuchblattnummer: string;
};

export const grundstueckMiteigentumGarage: StepDefinition = {
  fields: {
    ...miteigentumsanteil.fields,
    grundbuchblattnummer: {
      validations: {
        grundbuchblattnummer: {},
        requiredIfCondition: {
          condition: conditions.bundeslandIsNW,
          msg: "Für Grundstücke in Nordrhein-Westfalen muss immer ein Grundbuchblatt angegeben werden.",
        },
      },
    },
  },
};
