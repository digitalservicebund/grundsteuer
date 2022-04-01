import { StepDefinition } from "~/domain/steps";
import { conditions } from "~/domain/guards";

export type GrundstueckFlurstueckAngabenFields = {
  grundbuchblattnummer: string;
  gemarkung: string;
};

export const grundstueckFlurstueckAngaben: StepDefinition = {
  fields: {
    grundbuchblattnummer: {
      validations: {
        grundbuchblattnummer: {},
        requiredIfCondition: {
          condition: conditions.bundeslandIsNW,
          msg: "Für Grundstücke in Nordrhein-Westfahlen muss immer ein Grundbuchblatt angegeben werden.",
        },
      },
    },
    gemarkung: {
      validations: {
        maxLength: {
          maxLength: 25,
          msg: "Die Angabe darf maximal 25 Zeichen lang sein",
        },
        required: {},
      },
    },
  },
};
