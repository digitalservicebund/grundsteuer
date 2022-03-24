import _ from "lodash";
import { StepDefinition } from "~/domain/steps";
import {
  AdresseFields,
  stepDefinition as adresseStepDefinition,
} from "~/domain/steps/shared/adresse";

export type EigentuemerBruchteilsgemeinschaftAngabenFields = AdresseFields & {
  name: string;
};

export const eigentuemerBruchteilsgemeinschaftAngaben: StepDefinition = _.merge(
  {
    fields: {
      name: {
        validations: {},
      },
    },
  },
  adresseStepDefinition
);
