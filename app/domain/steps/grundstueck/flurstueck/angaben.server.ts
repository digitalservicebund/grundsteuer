import { StepDefinition } from "~/domain/steps/index.server";
import { conditions } from "~/domain/states/guards";

export type GrundstueckFlurstueckAngabenFields = {
  grundbuchblattnummer: string;
  gemarkung: string;
};

export const grundstueckFlurstueckAngaben: StepDefinition = {
  fields: {
    gemarkung: {
      validations: {
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen lang sein",
        },
        required: {},
      },
    },
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
